import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddAccountComponent } from './pages/add-account/add-account.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AccountBarComponent } from './components/account-bar/account-bar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { LastPostsComponent } from './components/last-posts/last-posts.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { AddPostDialogComponent } from './components/add-post-dialog/add-post-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from './pipes/filter.pipe';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { ButtonComponent } from './components/button/button.component';
import { PreviewModule } from './modules/preview/preview.module';
import { PublishingCalendarComponent } from './pages/publishing-calendar/publishing-calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ShowCalendarModalComponent } from './components/show-calendar-modal/show-calendar-modal.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { HttpRequestInterceptor } from './http-request-interceptor';
import { AuthService } from './services/auth.service';
import { InformationModalComponent } from './components/information-modal/information-modal.component';
import { JwtModule } from '@auth0/angular-jwt';
import { TokenInterceptor } from './token.interceptor';
import { DeleteWarningDialogComponent } from './components/delete-warning-dialog/delete-warning-dialog.component';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { UpdatePostDialogComponent } from './components/update-post-dialog/update-post-dialog.component';
import { RouteReuseStrategy } from '@angular/router';
import { AARouteReuseStrategy } from './aa-route-strategy';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { ReportCardComponent } from './components/report-card/report-card.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PostFilterComponent } from './components/post-filter/post-filter.component';
import { CheckoutsComponent } from './components/checkouts/checkouts.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { PostReportCardComponent } from './components/post-report-card/post-report-card.component';
import { MatSelectModule } from '@angular/material/select';
import { ReportPostDialogComponent } from './components/report-post-dialog/report-post-dialog.component';

import { AddNewHashtagDialogComponent } from './components/add-new-hashtag-dialog/add-new-hashtag-dialog.component';
import { TotalCalendarComponent } from './pages/total-calendar/total-calendar.component';
import { UpdateHashtagDialogComponent } from './components/update-hashtag-dialog/update-hashtag-dialog.component';

export function tokenGetter(): string {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    AddAccountComponent,
    SidebarComponent,
    AccountBarComponent,
    LayoutComponent,
    LastPostsComponent,
    BreadcrumbComponent,
    AddPostDialogComponent,
    FilterPipe,
    DropdownComponent,
    ButtonComponent,
    PublishingCalendarComponent,
    CalendarComponent,
    ShowCalendarModalComponent,
    ProfileComponent,
    CheckoutComponent,
    InformationModalComponent,
    DeleteWarningDialogComponent,
    ConfirmationDialogComponent,
    UpdatePostDialogComponent,
    ReportCardComponent,
    LineChartComponent,
    PostFilterComponent,
    CheckoutsComponent,
    ReportsComponent,
    PostReportCardComponent,
    ReportPostDialogComponent,
    AddNewHashtagDialogComponent,
    TotalCalendarComponent,
    UpdateHashtagDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularSvgIconModule.forRoot(),
    FormsModule,
    PreviewModule,
    CommonModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:4200'],
        disallowedRoutes: ['http://localhost:4200/register', 'http://localhost:4200/login'],
      },
    }),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    OwlDateTimeModule,
    ToastrModule.forRoot(),
    NgApexchartsModule,
    MatSelectModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    AuthService,
  ],
  entryComponents: [
    AddPostDialogComponent,
    InformationModalComponent,
    DeleteWarningDialogComponent,
    ConfirmationDialogComponent,
    UpdatePostDialogComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
