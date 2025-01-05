import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://melivecode.com/api';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: { username: string, password: string }) {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }
}
