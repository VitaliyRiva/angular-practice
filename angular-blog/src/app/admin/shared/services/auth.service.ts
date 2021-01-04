import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FbAuth, User} from '../interfaces';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {tap} from 'rxjs/operators';


@Injectable()

export class AuthService {
  constructor(private http: HttpClient) {}

  get token(): string | null {
    // @ts-ignore
    const expDate = new Date(localStorage.getItem('fb-token-exp'));
    if (new Date() > expDate) {
      this.logOut();
      return null;
    }

    return localStorage.getItem('fb-token');
  }

  login(user: User): Observable<FbAuth> {
    user.returnSecureToken = true;
    // @ts-ignore
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken)
      )
  }
  logOut() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  private setToken(response: FbAuth | null) {
    if (response) {
      // @ts-ignore
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000)
      if (response.idToken != null) {
        localStorage.setItem('fb-token', response.idToken)
      }
      localStorage.setItem('fb-token-exp', expDate.toString())
    } else {
      localStorage.clear();
    }
  }
}
