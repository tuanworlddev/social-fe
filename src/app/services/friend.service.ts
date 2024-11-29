import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Response } from '../interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getAllFriends(): Observable<Response> {
    return this.httpClient.get<Response>(`${this.apiUrl}/api/friends`);
  }

  getFriendByStatus(status: string): Observable<Response> {
    return this.httpClient.get<Response>(`${this.apiUrl}/api/friends/status?status=${status}`)
  }

  addFriend(friendId: number): Observable<Response> {
    return this.httpClient.post<Response>(`${this.apiUrl}/api/friends`, { friendId });
  }

  confirmFriend(friendId: number): Observable<Response> {
    return this.httpClient.patch<Response>(`${this.apiUrl}/api/friends/${friendId}`, { status: "accepted" });
  }

}
