import { LayoutComponent } from './components/layout/layout.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { AddAccountComponent } from './pages/add-account/add-account.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublishingCalendarComponent } from './pages/publishing-calendar/publishing-calendar.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AuthGuard } from './services/auth.guard';
import { ReportCardComponent } from './components/report-card/report-card.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { TotalCalendarComponent } from './pages/total-calendar/total-calendar.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'add-account',
        component: AddAccountComponent,
        data: { breadcrumb: 'Add Account' },
      },
      {
        path: 'calendar/:account_id',
        component: PublishingCalendarComponent,
        data: { breadcrumb: 'Calendar' },
      },
      {
        path: 'calendar',
        component: TotalCalendarComponent,
        data: { breadcrumb: 'Publishing Calendar' },
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { breadcrumb: 'Profile' },
      },
      {
        path: 'reports',
        component: ReportsComponent,
        data: { breadcrumb: 'Reports' },
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
        data: { breadcrumb: 'Checkout' },
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
