import { Injectable } from '@angular/core';
import { StoreBase } from './store.base';
import { interval, Observable, Subject, timer } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Account, Checkout, HashTag, IUser, Post } from '../constants/models';
import { AccountService } from '../services/account.service';
import { PostService } from '../services/post.service';
import { map } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { CheckoutService } from '../services/checkout.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { LinkedinService } from '../services/linkedin.service';
import { HashtagService } from '../services/hashtag.service';
import has = Reflect.has;

interface UserState {
  user: IUser;
  accounts: Account[];
  posts: Post[];
  checkouts: Checkout[];
  hashtags: HashTag[];
}

const initialState: UserState = {
  user: {
    id: null,
    email: null,
    jwt: null,
    plan: null,
    username: null,
    name: null,
    surname: null,
    gsmNumber: null,
    identityNumber: null,
    city: null,
    country: null,
    zipcode: null,
    confirmed: null,
    blocked: null,
    adress: null,
  },
  accounts: [],
  posts: [],
  checkouts: [],
  hashtags: [],
};

@Injectable({
  providedIn: 'root',
})
export class UserStore extends StoreBase<UserState> {
  user$: Observable<IUser> = this.select((state) => state.user);
  accounts$: Observable<Account[]> = this.select((state) => state.accounts);
  posts$: Observable<Post[]> = this.select((state) => state.posts);
  checkouts$: Observable<Checkout[]> = this.select((state) => state.checkouts);
  hashtags$: Observable<HashTag[]> = this.select((state) => state.hashtags);
  isInitialized$ = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private postService: PostService,
    private userService: UserService,
    private checkoutService: CheckoutService,
    private linkedinService: LinkedinService,
    private notifyService: NotificationService,
    private hashtagService: HashtagService,
    private router: Router
  ) {
    super(initialState);
    this.isInitialized$.next(false);

    this.loadUser();

    // timer(30000, 30000).subscribe(() => {
    //   this.loadUser();
    // });
    setInterval(() => {
      this.postService.getPostsByUserId(this.state.user.id).subscribe(posts => {
        this.setState({
          ...this.state,
          posts
        });
      });
    }, 30000);
  }

  loadUser(): void {
    this.authService.initialize().subscribe((user) => {
      this.setState({
        user: {
          ...this.state.user,
          id: user.id,
          email: user.email,
          jwt: localStorage.getItem('access_token'),
          plan: user.plan,
          username: user.username,
          name: user.name,
          surname: user.surname,
          gsmNumber: user.gsmNumber,
          identityNumber: user.identityNumber,
          city: user.city,
          country: user.country,
          zipcode: user.zipcode,
          confirmed: user.confirmed,
          blocked: user.blocked,
          adress: user.adress,
        },
        accounts: user.accounts,
        posts: user.posts,
        checkouts: user.checkouts,
        hashtags: user.hashtags,
      });
      console.log(this.state);
      this.isInitialized$.next(true);
    });
  }

  updateUser(user: IUser, id: number): void {
    this.userService.updateUser(user, id).subscribe(
      (updatedUser) => {
        this.setState({
          ...this.state,
          user: { ...this.state.user, ...updatedUser },
        });
        this.notifyService.showSuccess('Your profile updated successfully.', 'Success Message');
      },
      (error) => {
        this.notifyService.showError('Something went wrong while updating your profile!', 'Error Message');
      }
    );
  }

  deletePost(postId): void {
    this.postService.deletePostById(postId).subscribe(
      (post) => {
        this.setState({
          ...this.state,
          posts: this.state.posts.filter((item) => item.id !== post.id),
        });
        this.notifyService.showSuccess('This post deleted successfully.', 'Success Message');
      },
      (error) => {
        this.notifyService.showError('Something went wrong while deleting this post!', 'Error');
      }
    );
  }

  updatePost(post: Post | FormData): void {
    // @ts-ignore
    let postId;
    if (post instanceof FormData) {
      postId = JSON.parse(post.get('data') as string).id;
    } else {
      postId = post.id;
    }
    this.postService.updatePost(post, postId).subscribe(
      (updatedPost) => {
        this.setState({
          ...this.state,
          posts: this.state.posts.map((item) => (item.id === postId ? updatedPost : item)),
        });
        this.notifyService.showSuccess('This post updated successfully.', 'Success Message');
      },
      (error) => {
        this.notifyService.showError('Something went wrong while updating this post!', 'Error Message');
      }
    );
  }

  createPost(post: Post | FormData): void {
    this.postService.createPost(post).subscribe(
      (newPost) => {
        this.setState({
          ...this.state,
          posts: [...this.state.posts, newPost],
        });
        this.notifyService.showSuccess('This post created successfully.', 'Success Message');
      },
      (error) => {
        this.notifyService.showError('Something went wrong while creating this post!', 'Error Message');
      }
    );
  }

  createAccount(account: Account): void {
    this.accountService.createAccount(account).subscribe(
      (newAccount) => {
        this.setState({
          ...this.state,
          accounts: [...this.state.accounts, newAccount],
        });
        this.notifyService.showSuccess('Your account added successfully.', 'Success Message');
      },
      (error) => {
        this.notifyService.showError('Something went wrong while adding this account!', 'Error Message');
      }
    );
  }

  updateAccount(account: Account): void {
    this.accountService.updateAccount(account).subscribe(
      (updatedAccount) => {
        this.setState({
          ...this.state,
          accounts: this.state.accounts.map((acc) => (acc.id === account.id ? updatedAccount : acc)),
        });
        this.notifyService.showSuccess('Your account updated successfully.', 'Success Message');
      },
      (error) => {
        this.notifyService.showError('Something went wrong while updating this account!', 'Error Message');
      }
    );
  }

  alreadyHasAccount(pageId): boolean {
    if (this.state.accounts.length < 1) {
      return false;
    }
    const foundAccount = this.state.accounts.find((account) => account.account_key === pageId);

    if (foundAccount) {
      return true;
    }

    return false;
  }

  dontHaveAccountAnymore(returnedPages: string[], provider: string): void {
    if (provider === 'facebook') {
      this.state.accounts.forEach((account) => {
        if (account.provider === provider && !returnedPages.includes(account.account_key)) {
          account.active = false;
          this.updateAccount(account);
        }
      });
    }
  }

  getAccountByAccountKey(accountKey): Account {
    return this.state.accounts.find((account) => account.account_key === accountKey);
  }

  checkout(conf: object): any {
    this.checkoutService.checkout(conf).subscribe((res) => {
      localStorage.setItem('IYZICO_TOKEN', res.token);
      window.location.href = res.paymentPageUrl;
    });
  }

  checkPayment(token: string): any {
    this.checkoutService.checkPayment(token).subscribe((res) => {
      if (res.status === 'success') {
        const checkout = {
          name: res.paymentId,
          token: res.token,
          status: res.status,
          user: this.state.user,
          created_at: 'null',
          price: res.price,
        };

        this.userService.updateUser({ ...this.state.user, plan: 4 }, Number(this.state.user.id)).subscribe((data) => {
          this.setState({
            ...this.state,
            user: { ...this.state.user, plan: data.plan },
          });
        });

        this.checkoutService.saveCheckout(checkout).subscribe((data) => {
          checkout.created_at = data.created_at;
          this.setState({
            ...this.state,
            checkouts: [...this.state.checkouts, checkout],
          });

          localStorage.removeItem('IYZICO_TOKEN');
          this.notifyService.showSuccess('You switched to pro version successfully.', 'Success Message');
          this.router.navigate(['/dashboard/profile']);
        });
      } else {
        this.notifyService.showSuccess('Try another day..', 'Error Message');
      }
    });
  }

  saveLinkedinAccount(user: IUser, token: string): void {
    this.linkedinService.getMe(token).subscribe((data) => {
      if (this.alreadyHasAccount(data['id'])) {
        const found = this.getAccountByAccountKey(data['id']);
        if (!found.active) {
          found.active = true;
          this.updateAccount(found);
        } else {
          this.notifyService.showWarning('This account already added.', 'Warning Message');
        }
      } else {
        const accountObject: Account = {
          provider: 'linkedin',
          title: `${data['localizedFirstName']} ${data['localizedLastName']}`,
          active: true,
          account_key: data['id'],
          accessToken: token,
          user,
        };
        this.createAccount(accountObject);
      }
    });
  }

  getAccountById(accountId): Account {
    return this.state.accounts.find((account) => account.id === accountId);
  }

  createHash(hashtag: HashTag): void {
    this.hashtagService.createHash(hashtag).subscribe(
      (newHashTag) => {
        this.setState({
          ...this.state,
          hashtags: [...this.state.hashtags, newHashTag],
        });
        this.notifyService.showSuccess('New Hashtag added successfully.', 'Success Message');
      },
      (error) => {
        this.notifyService.showError('Something went wrong while adding this hashtag!', 'Error Message');
      }
    );
  }

  deleteHash(hashId: number): void {
    this.hashtagService.deleteHash(hashId).subscribe(
      (hashtag) => {
        this.setState({
          ...this.state,
          hashtags: this.state.hashtags.filter((item) => item.id !== hashtag.id),
        });
        this.notifyService.showSuccess('Hashtag deleted successfully.', 'Success Message');
      },
      (error) => {
        this.notifyService.showError('Something went wrong while deleting this hashtag!', 'Error');
      }
    );
  }

  updateHash(hashtag: HashTag): void {
    this.hashtagService.updateHash(hashtag, hashtag.id).subscribe(
      (updatedHash) => {
        this.setState({
          ...this.state,
          hashtags: this.state.hashtags.map((hash) => (hash.id === hashtag.id ? updatedHash : hash)),
        });
        this.notifyService.showSuccess('Your hashtag updated successfully.', 'Success Message');
      },
      (error) => {
        this.notifyService.showError('Something went wrong while updating this hashtag!', 'Error Message');
      }
    );
  }

  getLoggedInUser(): IUser {
    return this.state.user;
  }
}
