import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { InformationModalComponent } from '../../components/information-modal/information-modal.component';
import { IAuthResponse } from '../../constants/models';
import { Router } from '@angular/router';
import { FacebookService } from '../../services/facebook.service';

declare let FB;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  clientId = '431566724493665';
  clientSecret = 'f368736a2388605de5bbd12fbfb5d323';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router,
    private fbService: FacebookService,
    private ngZone: NgZone
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['']);
    }
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get name(): any {
    return this.registerForm.get('name');
  }

  get email(): any {
    return this.registerForm.get('email');
  }

  get password(): any {
    return this.registerForm.get('password');
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

  onRegister(): void {
    this.registerForm.value.username = this.email.value;
    this.authService.register(this.registerForm.value)
      .subscribe(
        (data: IAuthResponse) => {
          localStorage.setItem('access_token', data.jwt);
          const successDialog = this.dialog.open(InformationModalComponent, {
            data: {
              success: true,
              description: 'New user successfully created.',
              title: 'Successful registration'
            }
          });

          successDialog.afterClosed().subscribe(
            (dialogClosedData) => {
              this.router.navigate(['']);
              window.location.reload();
            }
          );
        },
        (error) => {
          const errorMessage = error.error.data[0].messages[0].message;
          this.dialog.open(InformationModalComponent, {
            data: {
              success: false,
              description: errorMessage,
              title: 'Error On User Registration'
            }
          });
        }
      );
  }

}
