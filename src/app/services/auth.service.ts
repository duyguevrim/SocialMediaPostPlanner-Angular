import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiUrl } from '../constants/constants';
import { IAuthResponse } from '../constants/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials): any {
    return this.http.post(`${apiUrl}/auth/local`, credentials);
  }

  register(credentials): any {
    return this.http.post(`${apiUrl}/auth/local/register`, credentials);
  }

  getMe(): any {
    return this.http.get(`${apiUrl}/users/me`);
  }

  getToken(): string {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('access_token') !== null;
  }

  initialize(): any {
    return this.http.get(`${apiUrl}/initialize`);
  }
}
