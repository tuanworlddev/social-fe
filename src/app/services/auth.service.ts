import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment.development';
import {User} from '../models/User';
import {Observable} from 'rxjs';
import {ResponseDto} from '../models/ResponseDto';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  loggedIn(): boolean {
    return false;
  }

  register(user: Partial<User>): Observable<ResponseDto> {
    return this.httpClient.post<ResponseDto>(`${this.apiUrl}/api/auth/register`, user);
  }

}
