import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input('content') content: string;
  @Input('bgColor') bgColor: string;
  @Input('textColor') textColor: string;
  @Input('type') type: string;


  constructor() {
  }

  ngOnInit(): void {
  }

}
