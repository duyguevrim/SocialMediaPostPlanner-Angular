import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../constants/constants';
import { IUser } from '../constants/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  updateUser(user: IUser, id: number): Observable<IUser> {
    return this.http.put<IUser>(`${apiUrl}/users/${id}`, user);
  }
}
