import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserStore } from '../../stores/user.store';
import { PostFilter } from '../../constants/models';
import { FacebookService } from '../../services/facebook.service';
import { getEpochToString } from '../../utilities';
import { MatDialog } from '@angular/material/dialog';
import { ReportPostDialogComponent } from '../../components/report-post-dialog/report-post-dialog.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  accounts;
  posts;
  user;
  filterObject: PostFilter = {};
  filteredPosts;
  selectedAccount;
  AllComments = [];
  epochToString = getEpochToString;
  @Output() filterSearch = new EventEmitter<PostFilter>();

  constructor(private userStore: UserStore, private fbService: FacebookService, public dialog: MatDialog) {
    this.userStore.user$.subscribe((user) => (this.user = user));
    // Active Accounts
    this.userStore.accounts$.subscribe((accounts) => {
      this.accounts = accounts.filter((account) => account.active);
    });

    this.userStore.posts$.subscribe((posts) => {
      const tempArr = [];
      this.accounts.forEach((account) => {
        posts
          .filter((post) => Number(post.account) === account.id)
          .forEach((p) => {
            tempArr.push(p);
          });
      });
      this.posts = tempArr;
    });
  }

  ngOnInit(): void {
  }

  selectAccount(e): void {
    if (e.target.value === '0') {
      delete this.filterObject.account;
    } else {
      this.filterObject.account = Number(e.target.value);
    }
  }

  openPostReportDialog(post): void {
    post.data = this.userStore.getAccountById(post.account);
    this.dialog.open(ReportPostDialogComponent, {
      data: post,
      disableClose: true,
      width: '1500px',
      height: '800px'
    });
  }

  search(): void {
    this.selectedAccount = this.accounts.filter((account) => Number(account.id) === this.filterObject.account);
    this.filteredPosts = this.posts.filter((post) => Number(post.account) === this.filterObject.account && post.posted === true);
    for (const post of this.filteredPosts) {
      this.fbService.getTotalLikesForPost(this.selectedAccount[0].accessToken, post.published_post_id).subscribe((res) => {
        post.totalLikes = res.likes.summary.total_count;
      });
      this.fbService.getTotalCommentsForPost(this.selectedAccount[0].accessToken, post.published_post_id).subscribe((res) => {
        post.totalComments = res.comments.summary.total_count;
        post.comments = res.comments.data;
        for (const comment of post.comments) {
          // console.log(comment);
          this.fbService.getTotalCommentsForPost(this.selectedAccount[0].accessToken, comment.id).subscribe((subCommentRes) => {
            console.log(subCommentRes);
            post.subComments = subCommentRes.comments.data;
            // ALL COMMENTS SERİALİZE İŞLEMİ YAPILACAK
          });
        }
      });

    }


  }

  totalLikes(accountAccessToken, postId): void {
    this.fbService.getTotalLikesForPost(accountAccessToken, postId).subscribe((res) => {
      console.log('resssss');
      return res.likes.summary.total_count;
    });
  }
}
