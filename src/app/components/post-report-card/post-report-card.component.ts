import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-report-card',
  templateUrl: './post-report-card.component.html',
  styleUrls: ['./post-report-card.component.scss']
})
export class PostReportCardComponent implements OnInit {
  @Input() posts;
  constructor() {
    console.log("postsss");
    console.log(this.posts);
  }

  ngOnInit(): void {
  }

}
