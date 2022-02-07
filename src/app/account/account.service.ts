import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IAddress } from '../shared/models/address';
import { IUser } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;

  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(values: any) {
    return this.http.post(this.baseUrl + 'account/login', values).pipe(
      map((user: IUser) => {
        if (user) {
          this.setCurrentUserSource(user);
          this.saveToken(user.token);
        }
      })
    );
  }

  register(values: any) {
    return this.http.post(this.baseUrl + 'account/register', values).pipe(
      map((user: IUser) => {
        if (user) {
          this.saveToken(user.token);
        }
      })
    );
  }

  getCurrentUser(token: string) {
    if (token === null) {
      this.setCurrentUserSource(null);
      return of(null);
    }
    let headers = this.getAuthorizationHeader(token);
    return this.http.get(this.baseUrl + 'account/user', { headers }).pipe(
      map((user: IUser) => {
        if (user) {
          this.setCurrentUserSource(user);
          this.saveToken(user.token);
        }
      })
    );
  }

  logout() {
    this.setCurrentUserSource(null);
    this.removeToken();
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }

  getUserAddress() {
    return this.http.get<IAddress>(this.baseUrl + 'account/address');
  }

  updateUserAddress(address: IAddress) {
    return this.http.put<IAddress>(this.baseUrl + 'account/address', address);
  }

  loadCurrentUserIfExist(component: string) {
    this.getCurrentUser(this.getToken())
      .subscribe(() => {
        console.log("User initiated from: " + component);
      }, error => {
        console.log(error);
      });

  }

  getUserObservable() {
    return this.currentUser$;
  }

  private getAuthorizationHeader(token: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  private setCurrentUserSource(user: IUser) {
    this.currentUserSource.next(user);
  }

  private saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  private isTokenExist() {
    if (this.getToken())
      return true;
    return false;
  }

  private getToken() {
    return localStorage.getItem('token');
  }

  private removeToken() {
    localStorage.removeItem('token');
  }

}


