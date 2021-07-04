import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiUrl } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class FacebookService {
  constructor(private http: HttpClient) {}

  getJwt(accessToken): any {
    return this.http.get(`${apiUrl}/auth/facebook/callback?access_token=${accessToken}`);
  }
  // getMe(accessToken): any {
  //   return this.http.get(`https://graph.facebook.com/me?fields=id,name&access_token=${accessToken}`);
  // }
  getLongLiveToken(accessToken, clientId, clientSecret): any {
    return this.http.get(`https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&
    client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${accessToken}`);
  }
  getPages(token): any {
    return this.http.get(`https://graph.facebook.com/me/accounts?access_token=${token}`);
  }

  getTotalLikesForPost(accessToken, postId): any {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`https://graph.facebook.com/${postId}?fields=likes.summary(true)&access_token=${accessToken}`);
  }

  getTotalCommentsForPost(accessToken, postId): any {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`https://graph.facebook.com/${postId}?fields=comments.summary(true)&access_token=${accessToken}`);
  }

  getCommentsForPost(accessToken, postId): any {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`https://graph.facebook.com/${postId}/comments?access_token=${accessToken}`);
  }

  publishPostToPage(accessToken, message, link): any {
    const JWT_TOKEN = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${JWT_TOKEN}`);
    return this.http.post(
      `https://graph.facebook.com/me/feed?message=${message}&link=${link}&access_token=${accessToken}&fields=permalink_url`,
      {},
      {
        headers,
      }
    );
  }
  publishPostToPageWithImage(accessToken, message, imageUrl): any {
    const JWT_TOKEN = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${JWT_TOKEN}`);
    return this.http.post(
      `https://graph.facebook.com/me/photos?url=${imageUrl}&access_token=${accessToken}&message=${message}&fields=permalink_url`,
      {},
      {
        headers,
      }
    );
  }
  deletePublishedPost(accessToken, publishedPostId): any {
    return this.http.delete(`https://graph.facebook.com/${publishedPostId}?access_token=${accessToken}`);
  }
}
