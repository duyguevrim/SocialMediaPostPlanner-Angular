import { Component, OnInit } from '@angular/core';
import { Checkout } from '../../constants/models';
import { UserStore } from '../../stores/user.store';
import { getDateToString, getStatusColor } from '../../utilities';

@Component({
  selector: 'app-checkouts',
  templateUrl: './checkouts.component.html',
  styleUrls: ['./checkouts.component.scss']
})
export class CheckoutsComponent implements OnInit {
  tableHeaders = ['Date', 'Price', 'Status'];
  checkouts: Checkout[];
  dateToString = getDateToString;
  statusColor = getStatusColor;

  constructor(private userStore: UserStore) {
    userStore.checkouts$.subscribe(checkouts => this.checkouts = checkouts);
  }

  ngOnInit(): void {
  }





}
