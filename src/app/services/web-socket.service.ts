import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';
import { Client } from '@stomp/stompjs';
import { WebSocketResponse } from '../interfaces/web-socket-response';
import { Subject } from 'rxjs';
import { Message } from '../interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private webSocketUrl = environment.webSocketUrl;
  private client?: Client;
  countUserOnlineSubject: Subject<any> = new Subject<any>();
  matchSubject: Subject<any> = new Subject<any>();
  offerSubject: Subject<any> = new Subject<any>();
  answerSubject: Subject<any> = new Subject<any>();
  candidateSubject: Subject<any> = new Subject<any>();
  nextSubject: Subject<any> = new Subject<any>();
  stopSubject: Subject<any> = new Subject<any>();
  messageSubject: Subject<any> = new Subject<any>();
  userStatusSubject: Subject<any> = new Subject<any>();

  constructor(private authService: AuthService) { }

  connect() {
    const token = this.authService.getToken();
    if (token) {
      this.client = new Client({
        brokerURL: this.webSocketUrl,
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 5000,
        heartbeatOutgoing: 0,
        debug: (err) => {
          console.log(err);
        },
        onConnect: () => {
          this.client?.subscribe('/topic/public', message => {
            console.log(message.body);
          }),
          this.client?.subscribe('/topic/call/count', message => {
            this.countUserOnlineSubject.next(message.body);
          });
          this.client?.subscribe('/topic/user/status', message => {
            this.userStatusSubject.next(message.body);
          });
          this.authService.getCurrentUser().subscribe(user => {
            this.client?.subscribe(`/queue/${user?.id}/call/match`, message => {
              console.log(message.body);
              this.matchSubject.next(message.body);
            });
            this.client?.subscribe(`/queue/${user?.id}/call/offer`, message => {
              console.log(message.body);
              this.offerSubject.next(message.body);
            });
            this.client?.subscribe(`/queue/${user?.id}/call/answer`, message => {
              console.log(message.body);
              this.answerSubject.next(message.body);
            });
            this.client?.subscribe(`/queue/${user?.id}/call/candidate`, message => {
              console.log(message.body);
              this.candidateSubject.next(message.body);
            });
            this.client?.subscribe(`/queue/${user?.id}/call/stop`, message => {
              console.log(message.body);
              this.stopSubject.next(message.body);
            });
            this.client?.subscribe(`/queue/${user?.id}/call/next`, message => {
              console.log(message.body);
              this.nextSubject.next(message.body);
            });
            this.client?.subscribe(`/queue/${user?.id}/messages`, message => {
              this.messageSubject.next(message.body);
            });
            this.sendMessageDestination({ userId: user?.id, status: 'online' }, '/app/user/status');
          });
          this.sendMessageDestination(null, '/app/call/increment');
        },
      });
      this.client.activate();
    }
  }

  sendMessage(message: any) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: '/app/chat',
        body: JSON.stringify(message)
      });
    }
  }

  sendMessageDestination(message: any, destination: string) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: destination,
        body: JSON.stringify(message)
      });
    }
  }

  logout() {
    if (this.client) {
      this.client.deactivate();
      this.client = undefined;
      console.log('WebSocket connection closed.');
    }
  }

}
