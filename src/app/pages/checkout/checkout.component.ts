import { Component, OnInit } from '@angular/core';
import { UserStore } from '../../stores/user.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  token: string;

  constructor(private userStore: UserStore, private router: Router) {
    if (localStorage.getItem('IYZICO_TOKEN')) {
      userStore.checkPayment(localStorage.getItem('IYZICO_TOKEN'));
    } else {
      this.router.navigate(['/dashboard/profile']);
    }
  }

  ngOnInit(): void {}

}
