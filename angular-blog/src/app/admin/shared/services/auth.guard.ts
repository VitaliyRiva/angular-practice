import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable()

export class AuthGuard implements  CanActivate{

  constructor(private auth: AuthService,
              private route: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    // @ts-ignore
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    } else {
      this.auth.logOut();
      this.route.navigate(['/admin', 'login'], {
        queryParams: {
          loginAgain: true
        }
      });
    }
  }

}
