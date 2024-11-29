import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';
import { Client } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private webSocketUrl = environment.webSocketUrl;
  private client?: Client;

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
          })
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

  logout() {
    if (this.client) {
      this.client.deactivate();
      this.client = undefined;
      console.log('WebSocket connection closed.');
    }
  }

}
