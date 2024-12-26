import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Response } from '../interfaces/response';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUser?: User;

  constructor(private httpClient: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<Response> {
    return this.httpClient.post<Response>(`${this.apiUrl}/api/auth/login`, { email, password });
  }

  register(email: string, password: string, fullName: string) {
    return this.httpClient.post<Response>(`${this.apiUrl}/api/auth/register`, { email, password, fullName });
  }

  getCurrentUser(): Observable<User | undefined> {
    if (this.currentUser) {
      return of(this.currentUser);
    }

    return this.httpClient.get<Response>(`${this.apiUrl}/api/auth/user`).pipe(
      map((response) => {
        this.currentUser = response.data;
        return this.currentUser;
      }),
      catchError((error) => {
        if (error.status === 401) {
          this.handleUnauthorized();
        }
        return throwError(() => error);
      })
    );
  }
  
  private handleUnauthorized(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  private clearSession(): void {
    this.currentUser = undefined;
    localStorage.removeItem('token');
    localStorage.removeItem('refresh-token');
  }

  logout() {
    const token = this.getToken();
    const refreshToken = this.getRefreshToken();
    this.httpClient.post<Response>(`${this.apiUrl}/api/auth/logout`, { token, refreshToken });
    this.currentUser = undefined;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.httpClient.post(`${this.apiUrl}/api/auth/logout`, {}).subscribe({
      next: () => console.log('Logged out successfully'),
      error: (error) => console.error('Error during logout:', error)
    });
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  saveRefreshToken(refreshToken: string): void {
    localStorage.setItem('refresh-token', refreshToken);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh-token');
  }

  isLoggedIn(): boolean {
    return this.getToken() ? true : false;
  }

}
