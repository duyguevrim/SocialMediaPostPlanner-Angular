import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { IlinkPreview } from '../../../constants/models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { getEpochToString } from '../../../utilities';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss'],
})
export class FacebookComponent implements OnInit, OnChanges {
  @Input() description: string;
  @Input() pageName: string;
  @Input() pageId: string;
  @Input() commentTime;
  @Input() link: string;
  @Input() isFocusOut: boolean;
  @Input() uploadUrls: Array<any>;
  @Input() isToggleFileUpload: boolean;
  @Input() isToggleLink: boolean;

  epochToString = getEpochToString;

  isOgDescriptionEdit = false;
  isOgTitleEdit = false;
  preview: IlinkPreview = {
    title: '',
    description: '',
    url: '',
    image: '',
  };

  constructor(private http: HttpClient) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(new Date(this.commentTime).getDay() + " " + new Date(this.commentTime).getUTCDate()+ " " + new Date(this.commentTime).getFullYear());
    // this.commentTime = Date.parse(this.commentTime);
    // console.log(this.commentTime);
    // console.log(typeof this.commentTime);
    // // @ts-ignore
    // console.log("------------");
    // console.log(this.epochToString(this.commentTime, 'dd MMM yyyy iii HH:mm'));
    console.log(`https://graph.facebook.com/${this.pageId}/picture?type=square&return_ssl_resources=1`);
    if (this.isToggleLink) {
      this.uploadUrls = [];
      this.isToggleFileUpload = false;
    }
    if (this.isToggleFileUpload) {
      this.link = '';
      this.isToggleLink = false;
    }
    if (this.isFocusOut === false) {
      console.log(changes.link.currentValue);
      this.link = changes.link.currentValue;
      console.log(this.link);
    }
    if (!this.isToggleLink) {
      this.preview = {
        title: '',
        description: '',
        url: '',
        image: '',
      };
    } else if (this.isFocusOut === true && this.link !== '') {
      console.log('link preview basliyor');
      console.log(this.link);
      if (this.link !== undefined) {
        this.getLinkPreview(this.link).subscribe(
          (preview) => {
            this.preview = preview;
            if (!this.preview.title) {
              this.preview.title = this.preview.url;
            }
          },
          (error) => {
            this.preview.url = this.link;
            this.preview.title = this.preview.url;
          }
        );
      }
    }
  }

  ngOnInit(): void {}

  getLinkPreview(link: string): Observable<any> {
    const api = 'https://api.linkpreview.net/?key=dc62a1cf7a869c0f9334b02a6d681484&q=' + link;
    return this.http.get(api);
  }

  getPageImgInfo(pageName): string {
    return pageName.split(' ')[0][0];
  }
}
