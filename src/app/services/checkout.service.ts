import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../constants/constants';
import { Checkout } from '../constants/models';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private http: HttpClient) {
  }

  getCheckouts(): Observable<Checkout[]> {
    return this.http.get<Checkout[]>(`${apiUrl}/checkouts?_sort=id:DESC`);
  }

  checkout(conf: object): Observable<Checkout> {
    return this.http.post<Checkout>(`${apiUrl}/checkouts/payment`, conf);
  }

  checkPayment(token: string): any {
    return this.http.post(`${apiUrl}/checkouts/check`, {token});
  }

  saveCheckout(checkout: Checkout): Observable<Checkout> {
    return this.http.post<Checkout>(`${apiUrl}/checkouts`, checkout);
  }
}
