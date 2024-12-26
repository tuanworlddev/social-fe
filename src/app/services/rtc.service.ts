import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RtcService {
  private peerConnection?: RTCPeerConnection;
  candidateSubject: Subject<any> = new Subject<any>();
  remoteStreamSubject: Subject<MediaStream> = new Subject<MediaStream>();
  connectedSubject: Subject<boolean> = new Subject<boolean>();
  messageSubject: Subject<any> = new Subject<any>();
  private dataChannel: RTCDataChannel | null = null;

  private rtcConfiguration = {
    iceServers: [
      {
        urls: 'turn:relay1.expressturn.com:3478',
        username: 'ef129RG76QDPBG8J4M',
        credential: 'BvL1gudsosFV60CK',
      },
    ],
  };

  constructor() { }

  createPeerConnection(localStream: MediaStream) {
    this.peerConnection = new RTCPeerConnection(this.rtcConfiguration);
    this.dataChannel = this.peerConnection.createDataChannel('myDataChannel');
    localStream.getTracks().forEach(track => this.peerConnection?.addTrack(track, localStream));
    this.peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        this.candidateSubject.next(candidate);
      }
    };
    this.peerConnection.ontrack = (event) => {
      this.remoteStreamSubject.next(event.streams[0]);
    };
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection?.connectionState;
      console.log(`Connection state changed: ${state}`);
      if (state === 'connected') {
        this.connectedSubject.next(true);
      } else if (state === 'disconnected' || state === 'failed' || state === 'closed') {
        this.connectedSubject.next(false);
      }
    };
    this.peerConnection.ondatachannel = (event) => {
      const receiveChannel = event.channel;
      receiveChannel.onmessage = (event) => {
        this.messageSubject.next(event.data);
      }
    }
  }

  async createOffer() {
    const offer = await this.peerConnection?.createOffer();
    await this.peerConnection?.setLocalDescription(offer);
    return offer;
  }

  async createAnswer() {
    const answer = await this.peerConnection!.createAnswer();
    await this.peerConnection!.setLocalDescription(answer);
    return answer;
  }

  async setRemoteDescription(answer: any) {
    await this.peerConnection!.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  }

  async setIceCandidate(candidate: any) {
    await this.peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
  }

  sendMessage(message: any) {
    if (this.peerConnection && this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(message);
    }
  }

  closePeerConnection() {
    if (this.peerConnection) {
      this.peerConnection!.close();
      this.peerConnection = undefined;
    }
  }
}
