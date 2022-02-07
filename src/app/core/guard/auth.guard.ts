import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';
import { IUser } from 'src/app/shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map(auth => {
        if (this.isUserLoggedIn(auth)) {
          return true;
        }
        this.router.navigate(['account/login'], { queryParams: { returnUrl: state.url } });
      })
    );
  }

  private isUserLoggedIn(user: IUser) {
    console.log(this.getUrl());
    if (user)
      return true;
    return false;
  }

  private getUrl() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        event.url;
      }
    });
  }

}
