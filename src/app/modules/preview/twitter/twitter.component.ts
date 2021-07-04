import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { IlinkPreview } from '../../../constants/models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.scss']
})
export class TwitterComponent implements OnInit, OnChanges {
  @Input() description: string;
  @Input() link: string;
  @Input() isFocusOut: boolean;
  @Input() uploadUrls: Array<any>;
  isOgDescriptionEdit = false;
  isOgTitleEdit = false;
  preview: IlinkPreview = {
    title: '',
    description: '',
    url: '',
    image: ''
  };

  constructor(private http: HttpClient) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.link !== undefined){
      this.link = changes.link.currentValue;
    }
    if(this.isFocusOut === true){
      if (this.link !== undefined) {
        this.getLinkPreview(this.link)
          .subscribe(preview => {
            this.preview = preview;
            if (!this.preview.title) {
              this.preview.title = this.preview.url;
            }
          }, error => {
            this.preview.url = this.link;
            this.preview.title = this.preview.url;
          });
      }
    }


  }

  ngOnInit(): void {
  }

  getLinkPreview(link: string): Observable<any> {
    const api = 'https://api.linkpreview.net/?key=dc62a1cf7a869c0f9334b02a6d681484&q=' + link;
    console.log(this.http.get(api));
    return this.http.get(api);
  }
}
