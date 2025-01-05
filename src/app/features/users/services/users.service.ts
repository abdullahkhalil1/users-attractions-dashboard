import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedUsers, User } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }

  getUsers(search: string = '', page: number = 1, per_page: number = 10, sort_column: string = 'id', sort_order: string = 'desc'): Observable<PaginatedUsers> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('per_page', per_page.toString())
      .set('sort_column', sort_column)
      .set('sort_order', sort_order);

    return this.http.get<PaginatedUsers>(`/users`, { params });
  }

  addUser(user: any): Observable<User> {
    return this.http.post<User>(`/users/create`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`/users/update`, user);
  }

  deleteUser(id: string): Observable<string> {
    const options = {
      body: { id }
    };
    return this.http.request<string>('delete', `/users/delete`, options);
  }
}