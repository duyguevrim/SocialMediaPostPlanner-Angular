import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { DeleteWarningDialogComponent } from '../delete-warning-dialog/delete-warning-dialog.component';
import { UpdatePostDialogComponent } from '../update-post-dialog/update-post-dialog.component';
import { Account } from '../../constants/models';
import { UserStore } from '../../stores/user.store';
import { getEpochToString, trimString } from '../../utilities';

@Component({
  selector: 'app-show-calendar-modal',
  templateUrl: './show-calendar-modal.component.html',
  styleUrls: ['./show-calendar-modal.component.scss'],
})
export class ShowCalendarModalComponent implements OnInit {
  tableHeaders = ['Name', 'Message', 'Status', 'Date', 'Actions'];
  trim = trimString;
  epochToString = getEpochToString;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog, private userStore: UserStore) {}

  ngOnInit(): void {}

  getProviderColor(provider: string): string {
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



  getAccountById(accountId): Account {
    return this.userStore.getAccountById(accountId);
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
      height: '810px',
    });
  }


}
