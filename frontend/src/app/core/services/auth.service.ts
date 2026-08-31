import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { RegisterRequest } from '../models/register-request.model';
import { Router } from '@angular/router';
import { NotificationService } from './notification-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private logoutTimer: ReturnType<typeof setTimeout> | null = null;
  constructor(private http: HttpClient, private router: Router, private notificationService: NotificationService) {
    if (localStorage.getItem('token')) {
      this.startAutoLogout();
    }
  }

  login(loginRequest: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, loginRequest);
  }

  register(registerRequest: RegisterRequest) {
    return this.http.post(`${this.apiUrl}/auth/register`, registerRequest);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.startAutoLogout();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(showSessionExpiredMessage = false): void {
    localStorage.removeItem('token');

    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }

    if (showSessionExpiredMessage) {
      this.notificationService.warning(
        'Session expired. Please log in again.'
      );
    }

    this.router.navigate(['/login']);
  }

  private getTokenPayload(token: string): any {
    try {
      const payload = token.split('.')[1];

      const base64 = payload
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }

  startAutoLogout(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    const payload = this.getTokenPayload(token);

    if (!payload?.exp) {
       this.logout(true);
      return;
    }

    const expiryTime = payload.exp * 1000;
    const remainingTime = expiryTime - Date.now();

    if (remainingTime <= 0) {
      this.logout(true);
      return;
    }

    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }

    this.logoutTimer = setTimeout(() => {
       this.logout(true);
    }, remainingTime);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();

    if (!token) {
      return true;
    }

    const payload = this.getTokenPayload(token);

    if (!payload?.exp) {
      return true;
    }

    return payload.exp * 1000 <= Date.now();
  }
}
