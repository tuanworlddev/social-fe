import { ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LocalStreamService } from '../../services/local-stream.service';
import { WebSocketService } from '../../services/web-socket.service';
import { WebSocketResponse } from '../../interfaces/web-socket-response';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user';
import { RtcService } from '../../services/rtc.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Message } from '../../interfaces/message';
import { NgClass } from '@angular/common';
import { FriendService } from '../../services/friend.service';
import { FriendResponse } from '../../interfaces/friend-response';

interface MessagePeer {
  sender: string,
  message: string
}

@Component({
  selector: 'app-video-call',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './video-call.component.html',
  styleUrl: './video-call.component.css'
})
export class VideoCallComponent implements OnInit, OnDestroy {
  @ViewChild('localVideo') localVideo!: ElementRef;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef;
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  user?: User;
  receiverId?: number;
  countUsersOnline = 0;
  friends: FriendResponse[] = [];

  isStarted: boolean = false;
  isSearching: boolean = false;
  localStream?: MediaStream;

  messages: MessagePeer[] = [];

  formSendMessage: FormGroup = new FormGroup({
    content: new FormControl('', Validators.required)
  });

  constructor(
    private localStreamService: LocalStreamService,
    private webSocketService: WebSocketService,
    private authService: AuthService,
    private rtcService: RtcService,
    private cdr: ChangeDetectorRef,
    private friendService: FriendService
  ) {
  }

  ngOnInit() {
    this.localStreamService.getLocalStream().then(stream => {
      this.localStream = stream;
      this.localVideo.nativeElement.srcObject = stream;
    });
    this.authService.getCurrentUser().subscribe(user => {
      console.log(user);
      this.user = user;
    });
    this.webSocketService.countUserOnlineSubject.subscribe(count => {
      this.countUsersOnline = count;
    });
    this.webSocketService.matchSubject.subscribe(message => {
      if (this.isStarted) {
        const response = JSON.parse(message);
        this.receiverId = response.receiver;
        this.handleConnect();
      }
    });
    this.webSocketService.offerSubject.subscribe(message => {
      if (this.isStarted) {
        const response = JSON.parse(message);
        this.receiverId = response.sender;
        this.handleOffer(response);
        this.isSearching = false;
      }
    });
    this.webSocketService.answerSubject.subscribe(message => {
      if (this.isStarted) {
        const response = JSON.parse(message);
        this.handleAnswer(response);
        this.isSearching = false;
      }
    });
    this.webSocketService.candidateSubject.subscribe(message => {
      if (this.isStarted) {
        const response = JSON.parse(message);
        this.handleCandidate(response);
      }
    })
    this.rtcService.candidateSubject.subscribe(candidate => {
      this.sendCandidate(candidate);
    });
    this.rtcService.remoteStreamSubject.subscribe(remoteStream => {
      this.remoteVideo.nativeElement.srcObject = remoteStream;
    });
    this.rtcService.messageSubject.subscribe(content => {
      const message: MessagePeer = {
        sender: 'client',
        message: content
      }
      this.messages.push(message);
      this.cdr.detectChanges();
      this.scrollToBottom();
    });
    this.webSocketService.stopSubject.subscribe(message => {
      this.rtcService.closePeerConnection();
      this.remoteVideo.nativeElement.srcObject = null;
      this.onMatch();
    });
    this.webSocketService.nextSubject.subscribe(message => {
      this.onNext();
    });
    this.webSocketService.sendMessageDestination(null, '/app/call/count');
    this.friendService.getFriends().subscribe(data => {
      this.friends = data;
    });
  }

  async handleConnect() {
    this.rtcService.createPeerConnection(this.localStream!);
    const offer = await this.rtcService.createOffer();
    this.webSocketService.sendMessageDestination(
      {
        sender: this.user?.id,
        receiver: this.receiverId,
        message: offer
      },
      `/app/call/offer`
    );
  }

  async handleOffer(response: any) {
    this.rtcService.createPeerConnection(this.localStream!);
    await this.rtcService.setRemoteDescription(response.message);
    const answer = await this.rtcService.createAnswer();
    this.webSocketService.sendMessageDestination(
      {
        sender: this.user?.id,
        receiver: this.receiverId,
        message: answer
      },
      `/app/call/answer`
    );
  }

  async handleAnswer(response: any) {
    await this.rtcService.setRemoteDescription(response.message);
  }

  async handleCandidate(response: any) {
    await this.rtcService.setIceCandidate(response.message);
  }

  sendCandidate(candidate: any) {
    this.webSocketService.sendMessageDestination(
      {
        sender: this.user?.id,
        receiver: this.receiverId,
        message: candidate
      },
      `/app/call/candidate`
    )
  }

  onChangeStatus() {
    this.isStarted = !this.isStarted;
  }

  onStart() {
    this.isStarted = true;
    this.onMatch();
  }

  onNext() {
    this.rtcService.closePeerConnection();
    this.remoteVideo.nativeElement.srcObject = null;
    if (this.isStarted && !this.isSearching) {
      this.webSocketService.sendMessageDestination({
        sender: this.user?.id,
        receiver: this.receiverId
      }, "/app/call/next");
    }
    this.onMatch();
  }

  onStop() {
    this.isStarted = false;
    this.rtcService.closePeerConnection();
    this.remoteVideo.nativeElement.srcObject = null;
    this.messages = [];
    this.webSocketService.sendMessageDestination({
      sender: this.user?.id,
      receiver: this.receiverId
    }, "/app/call/stop");
  }

  onMatch() {
    this.isSearching = true;
    this.messages = [];
    const request: WebSocketResponse = {
      sender: this.user?.id
    };
    this.webSocketService.sendMessageDestination(
      request, '/app/call/match'
    );
  }

  ngOnDestroy(): void {
    this.localStreamService.close();
  }

  @HostListener('window:unload', ['$event'])
  handleUnload(event: Event) {
    this.cleanupOnExit();
  }

  private cleanupOnExit() {
    this.webSocketService.sendMessageDestination({
      sender: this.user?.id,
      receiver: this.receiverId
    }, "/app/call/stop");
    this.webSocketService.sendMessageDestination(null, '/app/call/decrement');
    this.webSocketService.sendMessageDestination({ userId: this.user?.id, status: 'offline' }, '/app/user/status');
    this.localStreamService.close();
  }

  sendMessage() {
    if (this.isStarted && !this.isSearching && this.formSendMessage.valid) {
      const content = this.formSendMessage.get('content')?.value.trim();
      if (content) {
        const message: MessagePeer = {
          sender: 'me',
          message: content
        };
        this.messages.push(message);
        this.cdr.detectChanges();
        this.scrollToBottom();
        this.rtcService.sendMessage(content);
        this.formSendMessage.reset();
      }
    }
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  sendFriendRequest(): void {
    this.friendService.sendFriendRequest(this.receiverId!).subscribe(() => {
      alert('Friend request sent!');
    });
  }

  checkFriend(): boolean {
    return this.friends.some(friend => friend.friend.id === this.receiverId);
  }

}
