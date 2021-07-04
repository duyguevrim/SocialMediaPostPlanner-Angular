import { Component, OnInit } from '@angular/core';
import { LoadingService } from './services/loading.service';
import { delay } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatDialog } from '@angular/material/dialog';
import { InformationModalComponent } from './components/information-modal/information-modal.component';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UserStore } from './stores/user.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ngsocial';
  loading = false;

  // tslint:disable-next-line:variable-name
  constructor(
    private _loading: LoadingService,
    private jwtHelper: JwtHelperService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
  ) {
    const token = localStorage.getItem('access_token');
    if (token) {
      if (jwtHelper.isTokenExpired()) {
        const dialogRef = this.dialog.open(InformationModalComponent, {
          data: {
            success: false,
            title: 'Your session expired',
            description: 'Your session expired. Please login again.'
          }
        });

        dialogRef.afterClosed().subscribe(
          (dialogClosedData) => {
            this.router.navigate(['login']);
          }
        );
      }
    }
  }

  ngOnInit(): void {
    this.listenToLoading();
  }

  listenToLoading(): void {
    this._loading.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
      });
  }
}
