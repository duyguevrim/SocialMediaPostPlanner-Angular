import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.scss']
})
export class ReportCardComponent implements OnInit {
  @Input('reportContent') reportContent: string;
  @Input('iconColor') iconColor: string;
  @Input('iconTitle') iconTitle: string;
  @Input('iconBg') iconBg: string;
  @Input('reportResult') reportResult: string;
  @Input('iconBgSubColor') iconBgSubColor: string;
  constructor() { }

  ngOnInit(): void {
  }

}
