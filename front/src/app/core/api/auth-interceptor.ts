import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, Observable, throwError } from 'rxjs'
import { environment } from '../../../environments/environment'
import { AuthenticatorService } from './authenticator.service'
import { TokenDataDto, UsersAuthApiService } from './generated/users'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authenticatorService: AuthenticatorService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      !req.url.includes(environment.apiUrl) ||
      req.url.includes(UsersAuthApiService.RefreshPath)
    ) {
      return next.handle(req)
    }

    const nextCb = (authToken: TokenDataDto | null) => {
      if (authToken) {
        req = req.clone({
          setHeaders: {
            'authorization': `Bearer ${authToken.jwt}`
          }
        })
      }

      return next.handle(req).pipe(
        catchError((err) => {
          return throwError(err)
        })
      )
    }

    if (this.authenticatorService.updateTokenInProgress) {
      return new Observable<HttpEvent<any>>((subscriber) => {
        this.authenticatorService.updateToken$.subscribe(
          (data: TokenDataDto | null) => {
            nextCb(data).subscribe({
              next: (r) => subscriber.next(r),
              error: (err) => {
                console.error(err)
                subscriber.error(err)
              }
            })
          }
        )
      })
    } else {
      return new Observable<HttpEvent<any>>((subscriber) => {
        this.authenticatorService
          .getOrRefreshAuthToken()
          .then((data: TokenDataDto | null) => {
            nextCb(data).subscribe({
              next: (r) => subscriber.next(r),
              error: (err) => {
                console.error(err)
                subscriber.error(err)
              }
            })
          })
      })
    }
  }
}
