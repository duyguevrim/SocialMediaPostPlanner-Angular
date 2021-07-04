import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { IAuthResponse } from '../../constants/models';
import { MatDialog } from '@angular/material/dialog';
import { InformationModalComponent } from '../../components/information-modal/information-modal.component';
import { Router } from '@angular/router';
import { FacebookService } from '../../services/facebook.service';

declare let FB;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  clientId = '431566724493665';
  clientSecret = 'f368736a2388605de5bbd12fbfb5d323';

  constructor(private fb: FormBuilder, private fbService: FacebookService, private authService: AuthService, public dialog: MatDialog, private router: Router, private ngZone: NgZone) {
    this.loginForm = this.fb.group({
      identifier: [''],
      password: ['']
    });

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['']);
    }
  }

  ngOnInit(): void {
  }

  facebook_login(): void {
    FB.login((response) => this.ngZone.run(() => {
      if (response.authResponse) {
        localStorage.setItem('FB_USER_ACCESS_TOKEN', response.authResponse.accessToken);
        localStorage.setItem('FB_USER_ID', response.authResponse.userID);

        this.fbService.getLongLiveToken(response.authResponse.accessToken, this.clientId, this.clientSecret)
          .subscribe((response2) => {
            localStorage.setItem('FB_LONG_LIVE_TOKEN', response2.access_token);
            this.fbService.getJwt(response.authResponse.accessToken).subscribe((data: IAuthResponse) => {
              localStorage.setItem('access_token', data.jwt);
              localStorage.setItem('USER_ID', String(data.user.id));
              this.router.navigate(['']);
              window.location.reload();
            });
          }, err => {
            const errorMessage = err.error.data[0].messages[0].message;
            this.dialog.open(InformationModalComponent, {
              data: {
                success: false,
                description: errorMessage,
                title: 'Failed login attempt'
              }
            });
          });
      }
    }));
  }

  onLogin(): void {
    this.authService.login(this.loginForm.value)
      .subscribe(
        (data: IAuthResponse) => {
          localStorage.setItem('access_token', data.jwt);
          this.router.navigate(['']);
          window.location.reload();
        },
        (error) => {
          const errorMessage = error.error.data[0].messages[0].message;
          this.dialog.open(InformationModalComponent, {
            data: {
              success: false,
              description: errorMessage,
              title: 'Failed login attempt'
            }
          });
        }
      );

  }

}
