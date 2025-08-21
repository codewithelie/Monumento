import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of, tap } from 'rxjs';

interface LoginResponse {
  message: string;
  data: {
    userName: string;
    accessToken: string;
    refreshToken: string;
  }
}

interface RefreshTokenResponse {
  message: string;
  data: {
    accessToken: string;  
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn: boolean = false 
  redirectUrl: string = ''
  private token: string | null = localStorage.getItem('access_token');

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.isLoggedIn = !!this.token;
  }

  login(identifiant: string, mdp: string): Observable<LoginResponse | boolean> {
    return this.http.post<LoginResponse>('http://localhost:3000/api/login', { username: identifiant, password: mdp }).pipe(
      tap(response => {
        this.token = response.data.accessToken;
        localStorage.setItem('access_token', response.data.accessToken);
        this.isLoggedIn = true; 
      },(err) => of(false))
    );
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    return this.http.post<RefreshTokenResponse>('http://localhost:3000/api/refresh-token', { token: this.token }).pipe(
      tap(response => {
        this.setToken(response.data.accessToken);
      })
    );
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  logout() {
    this.isLoggedIn = false;
  }

  getToken(): string | null {
    return this.token;
  }
 
}
