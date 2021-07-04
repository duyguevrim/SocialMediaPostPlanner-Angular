import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-information-modal',
  templateUrl: './information-modal.component.html',
  styleUrls: ['./information-modal.component.scss'],
})
export class InformationModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit(): void {
  }
}
