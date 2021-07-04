import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserStore } from '../../stores/user.store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IUser } from '../../constants/models';
import { NotificationService } from '../../services/notification.service';
import { getPlanColor } from '../../utilities';
import { apiUrl } from '../../constants/constants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: IUser;
  accountsLength: number;
  publishedPostsLength: number;
  pendingPostsLength: number;
  totalPostsLength: number;
  profileForm: FormGroup;
  accounts;
  posts;

  planColor = getPlanColor;

  constructor(private http: HttpClient, private notifyService: NotificationService, private userStore: UserStore, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: [''],
      surname: [''],
      // email: [''],
      gsmNumber: [''],
      // username: [''],
      city: [''],
      country: [''],
      zipcode: [''],
      adress: [''],
      // confirmed: [false],
    });

    this.userStore.user$.subscribe(user => this.user = user);

    this.profileForm.get('name').setValue(this.user.name);
    this.profileForm.get('surname').setValue(this.user.surname);
    // this.profileForm.get('email').setValue(this.user.email);
    this.profileForm.get('gsmNumber').setValue(this.user.gsmNumber);
    // this.profileForm.get('username').setValue(this.user.username);

    this.profileForm.get('city').setValue(this.user.city);
    this.profileForm.get('country').setValue(this.user.country);
    this.profileForm.get('zipcode').setValue(this.user.zipcode);
    this.profileForm.get('adress').setValue(this.user.adress);
    // this.profileForm.get('confirmed').setValue(user.confirmed);

    // Active Accounts
    this.userStore.accounts$.subscribe(accounts => {
      this.accounts = accounts.filter(account => account.active);
    });

    // Active Account Posts
    this.userStore.posts$.subscribe(posts => {
      const tempArr = [];
      this.accounts.forEach(account => {
        posts.filter(post => Number(post.account) === account.id).forEach(p => {
          tempArr.push(p);
        });
      });
      this.posts = tempArr;
    });


    this.totalPostsLength = this.posts.length;
    this.publishedPostsLength = this.posts.filter(p => p.posted).length;
    this.pendingPostsLength = this.posts.filter(p => !p.posted).length;
  }

  ngOnInit(): void {}

  updateProfile(): void {
    this.userStore.updateUser(this.profileForm.value, Number(this.user.id));
  }

  checkout(): void {
    const conf = {
      price: 25,
      callbackUrl: `${apiUrl}/checkouts/redirect`
    };

    this.userStore.checkout(conf);
  }

  getAccountsLength(plan: string): string {
    switch (plan) {
      case 'Free':
        return this.accounts.length.toString() + '/' + this.user.plan.account_limit;
        break;
      case 'Pro':
        return this.accounts.length.toString();
        break;
      default:
        return '0';
        break;
    }
  }

  getPostsLength(plan: string): string {
    switch (plan) {
      case 'Free':
        return this.posts.length.toString() + '/' + this.user.plan.post_limit;
        break;
      case 'Pro':
        return this.posts.length.toString();
        break;
      default:
        return '0';
        break;
    }
  }
}
