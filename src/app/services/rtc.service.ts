import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RtcService {
  private peerConnection?: RTCPeerConnection;
  private remoteStream: Subject<MediaStream> = new Subject<MediaStream>();

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
    localStream.getTracks().forEach(track => this.peerConnection?.addTrack(track, localStream));
    this.peerConnection.ontrack = (event) => {
      this.remoteStream.next(event.streams[0]);
    };
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

  closePeerConnection() {
    if (this.peerConnection) {
      this.peerConnection!.close();
      this.peerConnection = undefined;
    }
  }
}
