import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FacebookService } from '../../services/facebook.service';
import {apiUrl} from '../../constants/constants';

@Component({
  selector: 'app-report-post-dialog',
  templateUrl: './report-post-dialog.component.html',
  styleUrls: ['./report-post-dialog.component.scss']
})
export class ReportPostDialogComponent implements OnInit {
  uploadUrls = [];
  isToggleFileUpload = false;
  isToggleLink = false;
  subComments;

  constructor(@Inject(MAT_DIALOG_DATA) public data, private fbService: FacebookService) {

    this.data.media.forEach((pic) => {
      this.uploadUrls.push(`${apiUrl}${pic.url}`);
    });
    if (this.data.link.length > 3) {
      this.isToggleLink = true;
      this.isToggleFileUpload = false;
    }
    if (this.uploadUrls.length > 0) {
      this.isToggleFileUpload = true;
      this.isToggleLink = false;
    }
    console.log(this.data.subComments);
    console.log(this.data.data);



  }

  ngOnInit(): void {
  }
}
