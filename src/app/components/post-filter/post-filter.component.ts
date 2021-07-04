import { Component, OnInit } from '@angular/core';
import { Post, PostFilter } from '../../constants/models';
import { UserStore } from '../../stores/user.store';
import { providers, dates, statuses, pageSizeOptions } from '../../constants/mock';
import { Output, EventEmitter } from '@angular/core';
import { search } from '../../utilities/index';

@Component({
  selector: 'app-post-filter',
  templateUrl: './post-filter.component.html',
  styleUrls: ['./post-filter.component.scss']
})
export class PostFilterComponent implements OnInit {
  tableHeaders = ['Name', 'Message', 'Status', 'Date', 'Actions'];
  user;
  filteredPosts;
  providers;
  posts;
  accounts;
  dates;
  statuses;
  pageSizeOptions;
  filterObject: PostFilter = {};

  @Output() filterSearch = new EventEmitter<PostFilter>();

  constructor(private userStore: UserStore) {
    this.userStore.user$.subscribe(user => this.user = user);
    // Active Accounts
    this.userStore.accounts$.subscribe(accounts => {
      this.accounts = accounts.filter(account => account.active);
    });
    this.statuses = statuses;
    this.pageSizeOptions = pageSizeOptions;
    this.providers = providers;
    this.dates = dates;

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

  }

  ngOnInit(): void {
    this.accounts.unshift({
      id: '0',
      title: 'All'
    });
  }


  search(): void {
    this.filterSearch.emit(this.filterObject);
  }

  selectAccount(e): void {
    if (e.target.value === '0') {
      delete this.filterObject.account;
    } else {
      this.filterObject.account = Number(e.target.value);
    }
  }

  // selectProvider(e): void {
  //   if (e.target.value === '0') {
  //     delete this.filterObject.provider;
  //   } else {
  //     this.filterObject.provider = Number(e.target.value);
  //   }
  // }

  selectStatues(e): void {
    if (e.target.value === '0') {
      delete this.filterObject.posted;
    }
    else if (e.target.value === '1'){
      this.filterObject.posted = false;
    }
    else {
      this.filterObject.posted = true;
    }
  }

  selectDate(e): void {
    if (e.target.value === '0') {
      delete this.filterObject.date;
    } else {
      this.filterObject.date = Number(e.target.value);
    }
  }
}
