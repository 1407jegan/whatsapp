import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, switchMap, catchError } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: any;

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken(); 
    //console.log(token);
    
    let authReq = req;
    if (token) {
      authReq = this.addToken(req, token);
    }

    return next.handle(authReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;
          this.refreshTokenSubject = new Observable<any>();

          return this.authService.refreshToken().pipe(
            switchMap((newToken: any) => {
              this.isRefreshing = false;
              if (newToken) {
                this.refreshTokenSubject.next(newToken);
                this.refreshTokenSubject.complete();
                this.authService.storeToken(newToken); 
                const newAuthReq = this.addToken(req, newToken);
                return next.handle(newAuthReq);
              } else {
                return throwError(() => error);
              }
            }),
            catchError(err => {
              this.isRefreshing = false;
              return throwError(() => err);
            })
          );
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
