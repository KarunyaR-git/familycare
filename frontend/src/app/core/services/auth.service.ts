import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { RegisterRequest } from '../models/register-request.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  login(loginRequest: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, loginRequest);
  }

  register(registerRequest: RegisterRequest) {
    return this.http.post(`${this.apiUrl}/auth/register`, registerRequest);
  }

  saveToken(token: string): void {
  localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
