import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { startOfDay } from 'date-fns';

import { Subject } from 'rxjs';
import { Post } from '../../constants/models';
import { ShowCalendarModalComponent } from '../show-calendar-modal/show-calendar-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import isSameDay from 'date-fns/isSameDay';
import fromUnixTime from 'date-fns/fromUnixTime';
import { AddPostDialogComponent } from '../add-post-dialog/add-post-dialog.component';
import { UserStore } from '../../stores/user.store';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input() posts: Post[];
  @Input() account: Account;
  @Input() isTotal: boolean;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.events = [];
    changes.posts.currentValue.forEach((post) => {
      this.addEvent(post);
    });
  }

  openDialog(data): void {
    this.dialog.open(ShowCalendarModalComponent, {
      data,
      disableClose: true,
      width: '1440px',
      height: '810px'
    });
  }

  dayClicked({ account, date, events }: { account: Account; date: Date; events: CalendarEvent[] }): void {

    if (events.length > 0) {
      const dayPosts = this.posts.filter((post) => isSameDay(fromUnixTime(Number(post.date)), date));
      this.openDialog({ posts: dayPosts, account, date });
    } else {
      let data;
      if (this.isTotal) {
        data = {
          isSelectedDate: true,
          isTotal: true,
          date
        };
      } else if (!this.isTotal) {
        data = {
          isSelectedDate: true,
          account: this.account,
          date
        };
      }

      if (this.isTotal) {
        const dialogRef = this.dialog.open(AddPostDialogComponent, {
          data,
          disableClose: true,
          width: '1440px',
          height: '810px'
        });
      } else if (!this.isTotal) {
        const dialogRef = this.dialog.open(AddPostDialogComponent, {
          data,
          disableClose: true,
          width: '1440px',
          height: '810px'
        });
      }
    }
    this.viewDate = date;
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
  }

  addEvent(post: Post): void {
    // Epoch to date string
    const d = new Date(0);
    d.setUTCSeconds(Number(post.date));

    this.events = [
      ...this.events,
      {
        title: post.posted ? 'published' : 'pending',
        start: startOfDay(d),
        // end: endOfDay(d),
        color: { primary: post.posted ? '#1BC5BD' : '#F64E60', secondary: '#eee' }
        // data: post,
      }
    ];
  }

  getStatus(id): string {
    let title = '';
    if (id === 1) {
      title = 'pending';
    } else if (id === 2) {
      title = 'published';
    } else {
      title = 'null';
    }
    return title;
  }
}
