import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Response } from '../interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) { }

  getAllUser(): Observable<Response> {
    return this.http.get<Response>(`${this.apiUrl}`);
  }

  updateStatus(userId: number, status: 'online' | 'offline'): Observable<string> {
    const url = `${this.apiUrl}/${userId}/status?status=${status}`;
    return this.http.put<string>(url, {});
  }

}
