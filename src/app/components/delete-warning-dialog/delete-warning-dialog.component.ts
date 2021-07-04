import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserStore } from '../../stores/user.store';
import { AddPostDialogComponent } from '../add-post-dialog/add-post-dialog.component';
import { FacebookService } from '../../services/facebook.service';
import { Account } from '../../constants/models';
import { TwitterService } from '../../services/twitter.service';

@Component({
  selector: 'app-delete-warning-dialog',
  templateUrl: './delete-warning-dialog.component.html',
  styleUrls: ['./delete-warning-dialog.component.scss']
})
export class DeleteWarningDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteWarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private userStore: UserStore,
    private facebookService: FacebookService,
    private twitterService: TwitterService
  ) {
  }

  ngOnInit(): void {
  }

  chooseFunc(): void {
    if (this.data.option === 'post') {
      this.deletePost();
    }
    else if (this.data.option === 'hashtag') {
      this.deleteHash();
    }
    else {
      this.deleteAccount();
    }

    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteHash(): void {
    this.userStore.deleteHash(this.data.hashtag.id);
  }

  deletePost(): void {


    this.userStore.deletePost(this.data.post.id);
  }

  deleteAccount(): void {
    const selectedAccount = this.userStore.getAccountByAccountKey(this.data.accountKey);
    console.log(this.data.accountKey);
    selectedAccount.active = false;
    this.userStore.updateAccount(selectedAccount);
  }

  getAccountById(accountId): Account {
    return this.userStore.getAccountById(accountId);
  }

}
