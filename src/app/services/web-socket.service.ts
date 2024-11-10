import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Client, Stomp } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private webSocketUrl = environment.webSocketUrl;
  private client?: Client;
  private messageSubject: Subject<string> = new Subject<string>();

  constructor() {
    this.connect();
  }

  connect(): void {
    this.client = new Client({
      brokerURL: this.webSocketUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        this.client?.subscribe('/topic/messages', message => {
          this.messageSubject.next(message.body);
        });
      },
    });
    this.client.activate();
  }

  sendMessage(message: string) {
    if (this.client && this.client.connected) {
      this.client?.publish({ destination: '/app/sendMessage', body: message})
    }
  }

  getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }
}
