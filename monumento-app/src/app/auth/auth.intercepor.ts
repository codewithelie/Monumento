// src/app/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { catchError, Observable, switchMap } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    
    let clonedRequest = req;
    if(token) {
      const clonedRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }
    
    return next.handle(clonedRequest).pipe(

      catchError((error:any) => {
          if (error.status === 401) {
            return this.auth.refreshToken().pipe(
              switchMap((newToken) => {
                this.auth.setToken(newToken.data.accessToken);
                const clonedRequestWithNewToken = req.clone({
                  headers: req.headers.set('Authorization', `Bearer ${newToken.data.accessToken}`)
                });
                return next.handle(clonedRequestWithNewToken);
              })  
            )
          }  
          throw error;
        })
    )
  }
}

