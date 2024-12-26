import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FriendResponse } from '../interfaces/friend-response';
import { UserResponse } from '../interfaces/user-response';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  private apiUrl = `${environment.apiUrl}/api/friends`;

  constructor(private httpClient: HttpClient) { }

  getFriends(): Observable<FriendResponse[]> {
    return this.httpClient.get<FriendResponse[]>(`${this.apiUrl}`);
  }

  // Lấy danh sách những người không phải bạn bè
  getNotFriends(): Observable<UserResponse[]> {
    return this.httpClient.get<UserResponse[]>(`${this.apiUrl}/not-friends`);
  }

  // Lấy danh sách yêu cầu đang chờ
  getPendingRequests(): Observable<FriendResponse[]> {
    return this.httpClient.get<FriendResponse[]>(`${this.apiUrl}/requests/pending`);
  }

  // Gửi yêu cầu kết bạn
  sendFriendRequest(friendId: number): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/requests`, { friendId });
  }

  // Phản hồi yêu cầu kết bạn
  respondToRequest(requestId: number, response: string): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}/requests/${requestId}`, { response });
  }

}
