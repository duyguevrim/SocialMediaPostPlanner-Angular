import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { apiUrl } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class TwitterService {
  constructor(private http: HttpClient) {
  }

  // tslint:disable-next-line:typedef
  getRedirectUrl() {
    return this.http.get(`${apiUrl}/twitter/request_token`);
  }

  // tslint:disable-next-line:typedef
  saveAccessToken(oauthToken: string, oauthVerifier: string) {
    return this.http.get(`${apiUrl}/twitter/save_access_tokens?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`);
  }

  deletePublishedPost(accessToken, publishedPostId): any {
    return this.http.get(`${apiUrl}/twitter/delete?id=${publishedPostId}&token=${accessToken}`);
  }

  // tslint:disable-next-line:variable-name
  getProfiles(account_key): any {
    return this.http.get(`${apiUrl}/accounts?user=19&account_key=${account_key}`);
  }
}
