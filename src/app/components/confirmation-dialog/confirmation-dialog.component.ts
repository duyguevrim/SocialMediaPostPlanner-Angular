import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';
import { format, getUnixTime, subDays } from 'date-fns';
import { PostService } from '../../services/post.service';
import { UserStore } from '../../stores/user.store';
import { AddPostDialogComponent } from '../add-post-dialog/add-post-dialog.component';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  publishTime = format(this.data.date, 'dd/MM/yyyy kk:mm');
  user;
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private userStore: UserStore) {
    this.userStore.user$.subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.data.date = getUnixTime(this.data.date);
  }

  publishPost(): void {

    this.userStore.user$.subscribe(user => {
      for (const account of this.data.accounts) {
        if (this.data.images.length === 0) {
          const postData = {
            message: this.data.message,
            date: String(this.data.date),
            link: this.data.link,
            account,
            user: Number(user.id)
          };
          this.userStore.createPost(postData);
        } else {
          const postData = {
            message: this.data.message,
            date: String(this.data.date),
            link: this.data.link,
            account,
            user: Number(user.id)
          };
          const postFormData = new FormData();
          postFormData.append('data', JSON.stringify(postData));
          for (const image of this.data.images) {
            postFormData.append('files.media', image, image.name);
          }
          this.userStore.createPost(postFormData);
        }
      }
    });
    this.dialogRef.close(this.data);

  }

  updatePost(): void {

    const postId = this.data.id;
    if (this.data.images.length === 0) {
    const postData = {
      message: this.data.message,
      date: String(this.data.date),
      link: this.data.link,
      id: this.data.id
    };
    this.userStore.updatePost(postData);
    }
    else {
      const postData = {
        message: this.data.message,
        date: String(this.data.date),
        link: this.data.link,
        id: this.data.id
      };
      const postFormData = new FormData();
      postFormData.append('data', JSON.stringify(postData));
      for (const image of this.data.images) {
        postFormData.append('files.media', image, image.name);
      }
      this.userStore.updatePost(postFormData);
    }


    this.dialogRef.close();

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
