import { Component, OnInit } from '@angular/core';
// import { accounts } from '../../constants/mock';
import { Router } from '@angular/router';
import { UserStore } from '../../stores/user.store';
import { DeleteWarningDialogComponent } from '../delete-warning-dialog/delete-warning-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-account-bar',
  templateUrl: './account-bar.component.html',
  styleUrls: ['./account-bar.component.scss']
})
export class AccountBarComponent implements OnInit {
  accounts;
  activeAccountIndex = 0;
  searchAccount = '';
  user;

  constructor(private router: Router, private userStore: UserStore, public dialog: MatDialog) {
    // this.accounts = this.userStore.accounts$;
    this.userStore.accounts$.subscribe(accounts => {
      this.accounts = accounts.filter(account => account.active === true);
    });

    this.userStore.user$.subscribe(user => this.user = user);
  }

  deleteAccount(accountKey): void {
    this.dialog.open(DeleteWarningDialogComponent, {
      data: {
        accountKey,
        option: 'account',
        dialogContent: 'Your account will be deleted.'
      }
    });


  }

  ngOnInit(): void {
  }

  getProviderColor(provider): string {
    if (provider === 'facebook') {
      return '#1877f2';
    }
    if (provider === 'instagram') {
      return '#C13584';
    }
    if (provider === 'linkedin') {
      return '#1877f2';
    }
    if (provider === 'twitter') {
      return 'rgba(29,161,242,1.00)';
    }
  }

  navigateTo(e): void {
    this.router.navigate(['/dashboard/calendar', e.option._value.id]);
  }
}
