import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../constants/models';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../constants/constants';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient, private notifyService: NotificationService) {
  }

  getCurrentUserAccounts(userId): Observable<Account[]> {
    return this.http.get<Account[]>(`${apiUrl}/accounts?user=${userId}&_sort=id:DESC`);
  }

  createAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(`${apiUrl}/accounts`, account);
  }

  updateAccount(account: Account): Observable<Account> {
    return this.http.put<Account>(`${apiUrl}/accounts/${account.id}`, account);
  }
}
