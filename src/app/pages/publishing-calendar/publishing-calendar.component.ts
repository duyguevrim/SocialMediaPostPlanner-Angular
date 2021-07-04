import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddPostDialogComponent } from '../../components/add-post-dialog/add-post-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Account } from '../../constants/models';
import { UserStore } from '../../stores/user.store';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-publishing-calendar',
  templateUrl: './publishing-calendar.component.html',
  styleUrls: ['./publishing-calendar.component.scss']
})
export class PublishingCalendarComponent implements OnInit {
  account: Account;
  accounts;
  posts;
  user;
  postsArray;

  constructor(
    private userStore: UserStore,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private notifyService: NotificationService
  ) {

    // Active Accounts
    this.userStore.accounts$.subscribe(accounts => {
      this.accounts = accounts.filter(account => account.active);
    });

    // Active Account Posts
    this.userStore.posts$.subscribe(posts => {
      const tempArr = [];
      this.accounts.forEach(account => {
        posts.filter(post => Number(post.account) === account.id).forEach(p => {
          tempArr.push(p);
        });
      });
      this.posts = tempArr;
    });

    // Get User
    this.userStore.user$.subscribe(user => this.user = user);

    this.route.params.subscribe((val) => {
      const accountId = Number(val.account_id);
      this.userStore.accounts$.subscribe(accounts => {
        this.account = accounts.find(account => account.id === accountId);
      });
      this.userStore.posts$.subscribe(posts => {
        // @ts-ignore
        this.postsArray = posts.filter(post => post.account === accountId);
      });

    });

  }

  ngOnInit(): void {
  }

  openDialog(): void {
    if (this.accounts.length === 0 ){
      this.notifyService.showWarning('Please add an account to create a post.', 'Warning Message');
    }
    else if (this.posts.length >= this.user.plan.post_limit) {
      this.notifyService.showError('You have reached the free plan limit of 5 post. Please switch to pro version.', 'Error Message');
    } else {
      const dialogRef = this.dialog.open(AddPostDialogComponent, {
        disableClose: true,
        width: '1440px',
        height: '810px'
      });
    }
  }
}
