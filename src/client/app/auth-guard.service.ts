import { Injectable }     from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}                         from '@angular/router';

/*
* Angular route protector. Apply to all routes that require to be logged in.
*/
import { AccountService } from './services/account.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private accountService: AccountService, private router: Router) {}

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.accountService.isLoggedIn()) return true;
    this.accountService.redirectUrl = url;
    this.router.navigate(['/signin']);
    return false;
  }

}
