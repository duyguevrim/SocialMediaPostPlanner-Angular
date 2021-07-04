import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { sidebarMenu } from '../../constants/menu';
import { AddPostDialogComponent } from '../add-post-dialog/add-post-dialog.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserStore } from '../../stores/user.store';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent implements OnInit {
  menuItems;
  accounts;
  posts;
  user;

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    private userStore: UserStore,
    private notifyService: NotificationService
  ) {
    this.menuItems = sidebarMenu;

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

    this.userStore.user$.subscribe(user => this.user = user);
  }

  ngOnInit(): void {}

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

  logout(): void {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
