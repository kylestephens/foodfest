import { Component }        from '@angular/core';
import { Subscription }     from 'rxjs/Subscription'

import { AccountService }   from '../../services/account.service';
import { ModalService }     from '../../services/modal.service';

import { CONSTANT }         from '../../core/constant';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'account-meta',
  templateUrl: 'account-meta.component.html',
  styleUrls: ['account-meta.component.css']
})

export class AccountMetaComponent {

  private subscription: Subscription;
  private subMessage: any;

  public firstName: string = this.accountService.getFirstName();;
  public avatar: string = '';
  public loggedIn: boolean = false;

  constructor(
    private accountService: AccountService,
    private modalService: ModalService
  ) {
    var me = this;
    debugger;
    this.loggedIn = this.accountService.isLoggedIn();

    // subscribe to messaging service messages
    this.subscription = this.accountService.getMessage().subscribe(subMessage => {
      console.debug('AccountMetaComponent::subscription');
      if(subMessage.event === CONSTANT.EVENT.SESSION.LOGGED_IN) {
        me.loggedIn = subMessage.sessionStatus;
        if(me.loggedIn) {
          me.firstName = me.accountService.getFirstName();
          me.avatar = me.accountService.getProfilePictureUrl();
        }
      }
    });
  };

  showSignUp(): void {
    console.debug('AccountMetaComponent::showSignUp');
    this.modalService.show(CONSTANT.MODAL.SIGN_UP);
  };

  showSignIn(): void {
    console.debug('AccountMetaComponent::showSignIn');
    this.modalService.show(CONSTANT.MODAL.SIGN_IN);
  };

}
