import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../../constants/models';
import { UserStore } from '../../stores/user.store';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import fromUnixTime from 'date-fns/fromUnixTime';
import { getProviderLimit, trimString } from '../../utilities';
import { UpdateHashtagDialogComponent } from '../update-hashtag-dialog/update-hashtag-dialog.component';
import { DeleteWarningDialogComponent } from '../delete-warning-dialog/delete-warning-dialog.component';
import { AddNewHashtagDialogComponent } from '../add-new-hashtag-dialog/add-new-hashtag-dialog.component';
import {apiUrl} from '../../constants/constants';

@Component({
  selector: 'app-update-post-dialog',
  templateUrl: './update-post-dialog.component.html',
  styleUrls: ['./update-post-dialog.component.scss']
})
export class UpdatePostDialogComponent implements OnInit {
  public publishTime = new Date();
  accounts: Observable<Account[]>;
  isToggleFileUpload = false;
  isToggleLink = false;
  description;
  link = '';
  url;
  uploadUrls = [];
  isFacebookPreview = true;
  isLinkedinPreview = false;
  files = [];
  isFocusOut = false;
  isToggleHashTag = false;
  hashtags = [];
  pageName;
  providerCharacterLimit = getProviderLimit;
  trim = trimString;

  constructor(
    private userStore: UserStore,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UpdatePostDialogComponent>,
    public dialogRefUpdate: MatDialogRef<UpdatePostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.accounts = this.userStore.accounts$;
    this.description = this.data.message;
    this.link = this.data.link;
    if (this.link.length > 3) {
      this.isToggleLink = true;
      this.isToggleFileUpload = false;
      this.isFocusOut = true;
    }
    this.publishTime = fromUnixTime(this.data.date);
    this.pageName = this.userStore.getAccountById(this.data.account).title;
    this.data.media.forEach((pic) => {
      this.uploadUrls.push(`${apiUrl}${pic.url}`);
      // this.uploadUrls.push(`http://localhost:1337${pic.url}`);
    });
    this.userStore.hashtags$.subscribe((hashtags) => {
      this.hashtags = hashtags;
    });
    if (this.uploadUrls.length > 0) {
      this.isToggleFileUpload = true;
      this.isToggleLink = false;
    }
  }

  ngOnInit(): void {
  }

  hashTagItemClick(item): void {
    this.description = item.content;
    this.isToggleHashTag = false;
  }

  hashTagItemUpdateClick(hashtag): void {
    this.dialog.open(UpdateHashtagDialogComponent, {
      data: hashtag,
      disableClose: true,
      width: '400px',
      height: '400px'
    });
  }

  hashTagItemDeleteClick(hashtag): void {
    this.dialog.open(DeleteWarningDialogComponent, {
      data: {
        hashtag,
        option: 'hashtag',
        dialogContent: 'Your hashtag will be deleted.'
      },
      disableClose: true,
    });
  }

  addNewHashTagClick(): void {
    this.dialog.open(AddNewHashtagDialogComponent, {
      disableClose: true,
      width: '400px',
      height: '400px'
    });
  }

  getAccountById(accountId): Account {
    return this.userStore.getAccountById(accountId);
  }

  changeInputText(e): void {
    this.description = e;
  }

  onSelectFile(event): void {
    this.uploadUrls = [];
    this.files = event.target.files;

    for (const file of this.files) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      // tslint:disable-next-line:no-shadowed-variable
      reader.onload = (event) => {
        this.url = (event.target as FileReader).result;
        this.uploadUrls.push(this.url);
      };
      this.isToggleLink = false;
      this.isToggleFileUpload = true;
      this.isFocusOut = false;
    }
  }

  updatePost(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: this.description,
        date: this.publishTime,
        id: this.data.id,
        link: this.link,
        buttonContent: 'Update',
        images: this.files
      },
      width: '500px',
      height: '350px'
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data !== true){
        this.dialogRefUpdate.close();
      }
    });
  }

  openFileUploadMenu(): void {
    this.isToggleFileUpload = !this.isToggleFileUpload;
    if (this.isToggleLink) {
      this.link = '';
    }
    this.isToggleLink = false;

  }

  openLinkUploadMenu(): void {
    this.isToggleLink = !this.isToggleLink;
    if (this.isToggleFileUpload) {
      this.uploadUrls = [];
    }
    this.isToggleFileUpload = false;
  }

  getProviderIcon(provider): string {
    if (provider === 'facebook') {
      return 'facebook-letter';
    }
    if (provider === 'instagram') {
      return 'instagram-shape';
    }
    if (provider === 'twitter') {
      return 'twitter-bird';
    }
    if (provider === 'linkedin') {
      return 'linkedin-letter';
    }
  }

  getProviderColor(provider): string {
    if (provider === 'facebook') {
      return '#1877f2';
    }
    if (provider === 'instagram') {
      return '#C13584';
    }
    if (provider === 'twitter') {
      return 'rgba(29,161,242,1.00)';
    }
    if (provider === 'linkedin') {
      return '#1877f2';
    }
  }
}

