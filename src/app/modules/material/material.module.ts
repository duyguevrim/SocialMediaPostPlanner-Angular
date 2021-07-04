import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  OWL_DATE_TIME_LOCALE,
  OwlDateTimeModule,
  OwlNativeDateTimeModule
} from 'ng-pick-datetime';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatListModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatCardModule,
    MatBadgeModule,
    MatDialogModule,
    MatMenuModule,
    MatCheckboxModule,
    MatInputModule,
    MatTabsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  exports: [
    MatIconModule,
    MatTooltipModule,
    MatListModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatCardModule,
    MatBadgeModule,
    MatDialogModule,
    MatMenuModule,
    MatCheckboxModule,
    MatInputModule,
    MatTabsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  providers: [
    // use french locale
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'tr'},
  ],
})
export class MaterialModule {}
