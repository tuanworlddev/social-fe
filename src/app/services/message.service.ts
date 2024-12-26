import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = `${environment.apiUrl}/api/messages`;

  constructor(private http: HttpClient) { }

  getMessages(userId1: number, userId2: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/${userId1}/${userId2}`);
  }

  sendMessage(senderId: number, receiverId: number, content: string): Observable<Message> {
    const params = { senderId, receiverId, content };
    return this.http.post<Message>(this.apiUrl, null, { params });
  }
  editMessage(messageId: string, newContent: string): Observable<Message> {
    const params = { newContent };
    return this.http.put<Message>(`${this.apiUrl}/${messageId}`, null, { params });
  }

  recallMessage(messageId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${messageId}`);
  }
}
