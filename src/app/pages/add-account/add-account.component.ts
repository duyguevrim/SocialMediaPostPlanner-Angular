import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FacebookService } from '../../services/facebook.service';
import { Account } from '../../constants/models';
import { TwitterService } from '../../services/twitter.service';
import { NotificationService } from '../../services/notification.service';
import { UserStore } from '../../stores/user.store';
import { ActivatedRoute } from '@angular/router';

declare let FB;

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit {
  clientId = _clientId;
  clientSecret = _clientSecret;
  accounts;
  loader = true;
  user;


  constructor(private http: HttpClient, private route: ActivatedRoute, private userStore: UserStore, private fbService: FacebookService, private twitterService: TwitterService, private notifyService: NotificationService) {
    // Active Accounts
    this.userStore.accounts$.subscribe(accounts => {
      this.accounts = accounts.filter(account => account.active);
    });
    // Get User
    this.userStore.user$.subscribe(user => this.user = user);


    this.route.queryParams.subscribe(params => {
      if (params.oauth_token &&  params.oauth_verifier) {
        this.saveAccessTokenTwitter(params.oauth_token,  params.oauth_verifier);
      }

      if (params.access_token) {
        console.log(params.access_token);
        this.userStore.saveLinkedinAccount(this.user, params.access_token);
      }
    });
  }


  ngOnInit(): void {}

  addFacebook(): void {

    // tslint:disable-next-line:max-line-length
    if (this.accounts.length >= this.user.plan.account_limit) {
      this.notifyService.showError('You have reached the Free plan limit of 3 social profiles. Please switch to pro version.', 'Error Message');
    } else {
      FB.login((response) => {
          if (response.authResponse) {
            const token = localStorage.getItem('FB_LONG_LIVE_TOKEN') || response.authResponse.accessToken;

            this.fbService.getPages(token).subscribe(res => {
              console.log((res.data.length + this.accounts.length) > this.user.plan.account_limit);
              if ((res.data.length + this.accounts.length) > this.user.plan.account_limit) {
                this.notifyService.showError('You have reached the Free plan limit of 3 social profiles. Please switch to pro version.', 'Error Message');
              } else {
                const returnedPageIds = [];

                for (const page of res.data) {
                  returnedPageIds.push(page.id);

                  if (this.userStore.alreadyHasAccount(page.id)) {
                    const found = this.userStore.getAccountByAccountKey(page.id);
                    if (!found.active) {
                      found.active = true;
                      this.userStore.updateAccount(found);
                    }
                  } else {
                    const accountObject: Account = {
                      title: page.name,
                      active: true,
                      accessToken: page.access_token,
                      account_key: page.id,
                      provider: 'facebook',
                      user: this.user
                    };
                    this.userStore.createAccount(accountObject);
                  }
                }

                this.userStore.dontHaveAccountAnymore(returnedPageIds, 'facebook');
              }
            }, error => {
              console.log('ERROR: ', error);
            });
          } else {
            // this.loading = false;
          }
        },
        {
          scope: 'pages_manage_posts,pages_manage_metadata,pages_manage_engagement,pages_read_engagement,pages_read_user_content, public_profile',
          return_scopes: true
        }
      );
    }

  }

  // tslint:disable-next-line:typedef
  saveAccessTokenTwitter(oauthToken: string, oauthVerifier: string) {
    this.twitterService.saveAccessToken(oauthToken, oauthVerifier).subscribe(res => {
      const accountObject: Account = {
        title: res['title'],
        active: true,
        accessToken: res['accessToken'],
        account_key: String(res['account_key']),
        provider: 'twitter',
        access_secret: res['access_secret'],
        user: this.user
      };
      // @ts-ignore
      // tslint:disable-next-line:no-shadowed-variable
      this.twitterService.getProfiles(String(res['account_key'])).subscribe(res => {
        if (res.length > 0) {
          if (res[0].active === false) {
            accountObject.id = res[0].id;
            this.userStore.updateAccount(accountObject);
          } else {
            this.notifyService.showError('You have already this account.', 'Error Message');
          }
        } else {
          this.userStore.createAccount(accountObject);
        }
      });
    });
  }

  // tslint:disable-next-line:typedef
  redirectToTwitter() {
    // tslint:disable-next-line:max-line-length
    if (this.accounts.length >= this.user.plan.account_limit) {
      this.notifyService.showError('You have reached the Free plan limit of 3 social profiles. Please switch to pro version.', 'Error Message');
    }
    else{
      this.twitterService.getRedirectUrl().subscribe((res: any) => {
        location.href = res.redirectUrl;
      });
    }

  }

  addLinkedin(): void {
    // window.location.href = `${apiUrl}/connect/linkedin`;
  }


}
