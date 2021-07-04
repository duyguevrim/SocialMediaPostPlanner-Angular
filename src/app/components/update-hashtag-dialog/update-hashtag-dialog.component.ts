import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { UserStore } from '../../stores/user.store';

@Component({
  selector: 'app-update-hashtag-dialog',
  templateUrl: './update-hashtag-dialog.component.html',
  styleUrls: ['./update-hashtag-dialog.component.scss']
})
export class UpdateHashtagDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UpdateHashtagDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private userStore: UserStore) {
  }

  hashTagForm = this.formBuilder.group(this.data);

  ngOnInit(): void {
    console.log(this.hashTagForm);
  }

  onSubmit(): void {
    this.hashTagForm.value.user = this.userStore.getLoggedInUser();
    this.userStore.updateHash(this.hashTagForm.value);
  }

}
