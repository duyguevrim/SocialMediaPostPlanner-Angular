import { Component, OnInit } from '@angular/core';
import { Router, Event, ActivationEnd, NavigationEnd } from '@angular/router';
import { buffer, filter, map, pluck } from 'rxjs/operators';

const isNavigationEnd = (ev: Event) => ev instanceof NavigationEnd;
const isActivationEnd = (ev: Event) => ev instanceof ActivationEnd;

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  bcLoadedData;
  bcForDisplay;

  constructor(private router: Router) {}

  ngOnInit() {
    const navigationEnd$ = this.router.events.pipe(filter(isNavigationEnd));

    this.router.events
      .pipe(
        filter(isActivationEnd),
        pluck('snapshot'),
        pluck('data'),
        buffer(navigationEnd$),
        map((bcData: any[]) => bcData.reverse())
      )
      .subscribe((x) => {
        this.bcLoadedData = x;
      });
  }
}
