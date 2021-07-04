import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../constants/constants';
import { Post } from '../constants/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  getPostsByUserId(userId): Observable<Post[]> {
    return this.http.get<Post[]>(`${apiUrl}/posts?user.id=${userId}&_sort=id:DESC`);
  }

  deletePostById(postId): Observable<Post> {
    return this.http.delete<Post>(`${apiUrl}/posts/${postId}`);
  }

  updatePost(post: Post | FormData, postId): Observable<Post> {
     return this.http.put<Post>(`${apiUrl}/postsa/${postId}`, post);
  }

  createPost(post: Post | FormData): Observable<Post> {
    return this.http.post<Post>(`${apiUrl}/posts`, post);
  }
}
