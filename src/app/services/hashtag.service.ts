import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HashTag } from '../constants/models';
import { apiUrl } from '../constants/constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HashtagService {
  constructor(private http: HttpClient) {}

  deleteHash(hashId): Observable<HashTag> {
    return this.http.delete<HashTag>(`${apiUrl}/hashtags/${hashId}`);
  }

  updateHash(hashtag: HashTag | FormData, hashId): Observable<HashTag> {
    return this.http.put<HashTag>(`${apiUrl}/hashtags/${hashId}`, hashtag);
  }

  createHash(hashtag: HashTag | FormData): Observable<HashTag> {
    return this.http.post<HashTag>(`${apiUrl}/hashtags`, hashtag);
  }

}
