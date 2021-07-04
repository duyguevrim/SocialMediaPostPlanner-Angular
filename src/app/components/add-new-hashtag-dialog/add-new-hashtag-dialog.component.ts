import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { UserStore } from '../../stores/user.store';

@Component({
  selector: 'app-add-new-hashtag-dialog',
  templateUrl: './add-new-hashtag-dialog.component.html',
  styleUrls: ['./add-new-hashtag-dialog.component.scss']
})
export class AddNewHashtagDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddNewHashtagDialogComponent>,
    private formBuilder: FormBuilder,
    private userStore: UserStore) {

  }

  hashTagForm = this.formBuilder.group({
    name: '',
    content: '',
  });

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.hashTagForm.value.user = this.userStore.getLoggedInUser();
    console.log(this.hashTagForm.value);
    this.userStore.createHash(this.hashTagForm.value);
  }
}
