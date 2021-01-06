import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FbAuth, User} from '../../../shared/interfaces';
import {Observable, Subject, throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';



@Injectable({providedIn: 'root'})

export class AuthService {

  public error$: Subject<string> = new Subject<string>();

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
        // @ts-ignore
        tap(this.setToken),
        // @ts-ignore
        catchError(this.handleError.bind(this))
      );
  }

  logOut(): void {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }


  private handleError(error: HttpErrorResponse): Observable<any> {
    const {message} = error.error.error;

    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('Неверны Email');
        break;
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Такого  email нет');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Неверны пароль');
        break;
    }

    return throwError(error);
  }

  private setToken(response: FbAuth | null): void {
    if (response) {
      const expDate = new Date(new Date().getTime() + Number(response.expiresIn) * 1000);
      if (response.idToken != null) {
        localStorage.setItem('fb-token', response.idToken);
      }
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }
  }
}
