import { Component, OnInit } from '@angular/core';
import { providers, dates, statuses, pageSizeOptions } from '../../constants/mock';
import { Account, IUser, Post, PostFilter } from '../../constants/models';

import { UserStore } from '../../stores/user.store';
import { MatDialog } from '@angular/material/dialog';
import { DeleteWarningDialogComponent } from '../delete-warning-dialog/delete-warning-dialog.component';
import { UpdatePostDialogComponent } from '../update-post-dialog/update-post-dialog.component';
import { getProviderColor, trimString, getEpochToString } from '../../utilities';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-last-posts',
  templateUrl: './last-posts.component.html',
  styleUrls: ['./last-posts.component.scss']
})
export class LastPostsComponent implements OnInit {
  tableHeaders = ['Name', 'Message', 'Status', 'Date', 'Actions'];
  user: IUser;
  filteredPosts;
  providers;
  posts;
  accounts;
  dates;
  statuses;
  pageSizeOptions;
  accountById;
  filterObject: PostFilter = {};

  providerColor = getProviderColor;
  trim = trimString;
  epochToString = getEpochToString;

  constructor(
    private userStore: UserStore,
    private postService: PostService,
    public dialog: MatDialog
  ) {
    this.statuses = statuses;
    this.pageSizeOptions = pageSizeOptions;
    this.providers = providers;
    this.dates = dates;

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
      this.filteredPosts = tempArr;
    });

    // Get User
    this.userStore.user$.subscribe(user => this.user = user);
  }

  ngOnInit(): void {
  }

  getAccountById(accountId): Account {
    return this.userStore.getAccountById(accountId);
  }

  filterSearch(postFilter: PostFilter): void {
    console.log(postFilter);
    this.filterObject = postFilter;
    // this.filteredPosts = search(postFilter, this.posts);
  }

  openDeleteDialog(post): void {
    this.dialog.open(DeleteWarningDialogComponent, {
      data: {
        post,
        option: 'post',
        dialogContent: 'Your post will be deleted.'
      }
    });
  }

  openUpdatePostDialog(post): void {
    this.dialog.open(UpdatePostDialogComponent, {
      data: post,
      disableClose: true,
      width: '1440px',
      height: '810px'
    });
  }
}
