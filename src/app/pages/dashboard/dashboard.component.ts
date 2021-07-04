import { Component, OnInit } from '@angular/core';
import { UserStore } from '../../stores/user.store';

declare let FB;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalPostLength: number;
  accountsLength: number;
  userPlan: string;
  accounts;
  userId;


  constructor(private userStore: UserStore) {
    // Active Accounts
    this.userStore.accounts$.subscribe(accounts => {
      this.accounts = accounts.filter(account => account.active);
      this.accountsLength = this.accounts.length;
    });

    // Active Account Posts
    this.userStore.posts$.subscribe(posts => {
      const tempArr = [];
      this.accounts.forEach(account => {
        posts.filter(post => Number(post.account) === account.id).forEach(p => {
          tempArr.push(p);
        });
      });
      this.totalPostLength = tempArr.length;
    });

    // Get User Plan
    this.userStore.user$.subscribe(user => this.userPlan = user.plan.name);
  }

  ngOnInit(): void {
  }


}
