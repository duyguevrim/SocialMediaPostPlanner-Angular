import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { apiUrl } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class LinkedinService {
  constructor(private http: HttpClient) {
  }
  // tslint:disable-next-line:typedef
  getMe(accessToken: string) {
    return this.http.post(`${apiUrl}/linkedin/me`, {token: accessToken});
  }

}
