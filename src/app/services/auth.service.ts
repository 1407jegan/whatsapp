import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environment';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  private tokenAccess = 'accessToken';
  private tokenRefresh = 'refreshToken';

  private http = inject(HttpClient)


  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.baseUrl+'login/', { email, password }).pipe(
      tap(response => this.handleAuthentication(response.token)),
      catchError(this.handleError)
    );
  }

  private handleAuthentication(response: any): void {
    // const accessToken = response.access_token;
    // const refreshToken = response.refresh_token;
    const accessToken = response.access_token;
    const refreshToken = response.refresh_token;
    // console.log(accessToken, refreshToken)
    localStorage.setItem(this.tokenAccess, accessToken); 
    localStorage.setItem(this.tokenRefresh, refreshToken); 
    localStorage.setItem('activeSlide', 'dashboard')
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenAccess);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenAccess);
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem(this.tokenRefresh);
    if (refreshToken) {
      return this.http.post<any>(this.baseUrl+'refresh/', { refresh_token: refreshToken }).pipe(
        tap(response => this.storeToken(response)),
        catchError(this.handleError)
      );
    }
    return of(null);
  }

   storeToken(response: any): void {
    const accessToken = response.access_token;
    const refreshToken = response.refresh_token;
    localStorage.setItem(this.tokenAccess, accessToken);
    localStorage.setItem(this.tokenRefresh, refreshToken);
  }

  private handleError(error: any): Observable<never> {
    alert('Invalid Email or Password')
    return of(); 
  }
}
