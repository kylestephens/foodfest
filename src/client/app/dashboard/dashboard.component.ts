import { Component }       from '@angular/core';
import { AccountService }  from '../services/account.service';
import { CONSTANT }        from '../core/constant';
import { Subscription }    from 'rxjs/Subscription';

@Component({
  moduleId: module.id,
  selector: 'ak-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent {
  firstName: string;
  isVendor: boolean;

  private subscription: Subscription;

  constructor(private accountService: AccountService) {
    this.setUserDetails();

    this.subscription = this.accountService.getMessage().subscribe(subMessage => {
      if(subMessage.event === CONSTANT.EVENT.SESSION.LOGGED_IN || subMessage.event === CONSTANT.EVENT.SESSION.USER_TYPE) {
        if(this.accountService.isLoggedIn()) {
          this.setUserDetails();
        }
      }
    });
  }

  setUserDetails() {
    this.isVendor = (this.accountService.getUser().user_type === CONSTANT.user.types.VENDOR.code) ? true : false;
  }
}
