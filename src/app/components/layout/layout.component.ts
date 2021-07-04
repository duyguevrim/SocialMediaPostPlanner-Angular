import { Component, OnInit } from '@angular/core';
import { UserStore } from '../../stores/user.store';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  show = false;

  constructor(
    private userStore: UserStore
  ) {}

  ngOnInit(): void {
    this.userStore.isInitialized$.subscribe(data => {
      this.show = true;
    });
  }
}
