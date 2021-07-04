import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserStore } from '../../stores/user.store';
import { Account } from '../../constants/models';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { NotificationService } from '../../services/notification.service';
import { getPlanColor, getProviderLimit, trimString } from '../../utilities';
import { MatMenuTrigger } from '@angular/material/menu';
import { UpdatePostDialogComponent } from '../update-post-dialog/update-post-dialog.component';
import { AddNewHashtagDialogComponent } from '../add-new-hashtag-dialog/add-new-hashtag-dialog.component';
import { DeleteWarningDialogComponent } from '../delete-warning-dialog/delete-warning-dialog.component';
import { UpdateHashtagDialogComponent } from '../update-hashtag-dialog/update-hashtag-dialog.component';

@Component({
  selector: 'app-add-post-dialog',
  templateUrl: './add-post-dialog.component.html',
  styleUrls: ['./add-post-dialog.component.scss'],
})
export class AddPostDialogComponent implements OnInit {
  public publishTime = new Date();
  accounts: Account[];
  posts;
  user;
  selectedArray = [];
  isToggleFileUpload = true;
  isToggleLink = false;
  isToogleHashTag = false;
  description = '';
  url;
  link = '';
  uploadUrls = [];
  isFacebookPreview = true;
  isTwitterPreview = false;
  isLinkedinPreview = false;
  files = [];
  isSelectedDate = false;
  isFocusOut = false;
  selectedDate;
  selectedProviders = [];
  hashtags = [];
  providerCharacterLimit = getProviderLimit;
  trim = trimString;
  isToggleHashTag = false;

  constructor(
    private userStore: UserStore,
    public dialog: MatDialog,
    public dialogRefPost: MatDialogRef<AddPostDialogComponent>,
    private notifyService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.userStore.user$.subscribe((user) => (this.user = user));

    // Active Accounts
    this.userStore.accounts$.subscribe((accounts) => {
      this.accounts = accounts.filter((account) => account.active);
    });

    this.userStore.hashtags$.subscribe((hashtags) => {
      this.hashtags = hashtags;
    });

    // Active Account Posts
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

    if (this.data !== null && !this.data.isTotal) {
      this.isSelectedDate = this.data.isSelectedDate;
      this.publishTime = this.data.date;
      this.selectedDate = this.data.date;
      this.selectedArray.push(this.data.account);
    }

  }

  ngOnInit(): void {}

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

  changeInputText(e): void {
    this.description = e;
  }

  getSelectedAccounts(e): void {
    if (e.checked) {
      this.selectedArray.push(e.source.value);
    } else {
      this.selectedArray = this.selectedArray.filter((page) => page !== e.source.value);
    }
    this.selectedProviders = this.selectedArray.map((item) => item.provider).filter((value, index, self) => self.indexOf(value) === index);
  }

  postValidation(): boolean {
    const linkReg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    if (this.selectedArray.length === 0) {
      this.notifyService.showWarning('Please select an account to continue.', 'Warning Message');
      return false;
    } else if (this.isOutOfCharacterLimit()) {
      this.notifyService.showWarning("You've gone beyond the maximum character count! Please edit your post.", 'Character Limit Message');
      return false;
    } else if (this.description.length < 2 && this.link.length < 2 && this.files.length === 0) {
      this.notifyService.showWarning('Please complete at least one of the fields to continue.', 'Missing Content Message');
      return false;
    } else if (this.link.length > 2 && this.link.match(linkReg) === null) {
      this.notifyService.showWarning('Please enter a valid link.', 'Link is not valid!');
      return false;
    }
    return true;
  }

  isOutOfCharacterLimit(): boolean {
    for (const provider of this.selectedProviders) {
      if (this.providerCharacterLimit(provider) - this.description.length < 0) {
        return true;
      }
    }
    return false;
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
    }
  }

  publishPost(publishTime): void {
    if (this.posts.length + this.selectedArray.length > this.user.plan.post_limit) {
      this.notifyService.showError(
        'With the sum of new posts to post, you have reached the free plan limit of 5 post. Please switch to pro version.',
        'Error Message'
      );
    } else {
      if (this.postValidation()) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            message: this.description,
            accounts: this.selectedArray,
            date: this.publishTime,
            link: this.link,
            images: this.files,
            buttonContent: 'Post',
          },
          width: '500px',
          height: '350px',
        });
        dialogRef.afterClosed().subscribe((data) => {
          if (data !== true) {
            this.dialogRefPost.close();
          }
        });
      }
    }
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
