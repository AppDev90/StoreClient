import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error) {
          if (this.isValidation(error))
            throw error.error;
          else if (this.isBadRequest(error))
            this.toastr.error(error.error.message, error.error.statusCode)
          else if (this.isAuthorization(error))
            this.toastr.error(error.error.message, error.error.statusCode)
          else if (this.isNotFound(error))
            this.router.navigateByUrl('/notfound-error');
          else if (this.isException(error)) {
            const navigationExtras: NavigationExtras = { state: { error: error.error } };
            this.router.navigateByUrl('/server-error', navigationExtras);
          }
        }
        return throwError(error);
      })
    );
  }

  isValidation(error: any) {
    if (error.status == 400 && error.error.errors)
      return true;
    return false;
  }

  isBadRequest(error: any) {
    if (error.status == 400 && !(error.error.errors))
      return true;
    return false;
  }

  isAuthorization(error: any) {
    return error.status == 401;
  }

  isNotFound(error: any) {
    return error.status == 404;
  }

  isException(error: any) {
    return error.status == 500;
  }

}
