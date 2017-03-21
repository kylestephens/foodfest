import { Component }        from '@angular/core';
import { Subscription }     from 'rxjs/Subscription';

import { LoginDetails }     from '../../model/login-details';

import { AccountService }   from '../../../services/account.service';
import { FacebookService }  from '../../../services/facebook.service';
import { GoogleService }    from '../../../services/google.service';
import { MessagingService } from '../../../services/messaging.service';
import { ModalService }     from '../../../services/modal.service';

import { CONSTANT }         from '../../../core/constant';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'signup',
  templateUrl: 'signup.component.html',
  styleUrls: ['signup.component.css']
})

export class SignupComponent {

  modalSubscription: Subscription;
  accountSubscription: Subscription;

  isEmailSignUp: boolean = false;
  recaptchaResponse: string = null;
  model = new LoginDetails();

  constructor(
    private accountService: AccountService,
    private facebookService: FacebookService,
    private googleService: GoogleService,
    private messagingService: MessagingService,
    private modalService: ModalService
  ) {
    var me = this;

    // subscribe to modal service messages
    this.modalSubscription = this.modalService.getMessage().subscribe(subMessage => {
      console.debug('SignupComponent::modalSubscription');
      if(subMessage.event && subMessage.event === CONSTANT.EVENT.MODAL.HIDE_MODAL) {
        me.isEmailSignUp = false;
      }
    });

    // subscribe to account service messages
    this.accountSubscription = this.accountService.getMessage().subscribe(subMessage => {
      console.debug('SignupComponent::accountSubscription');
      if(subMessage.event && subMessage.event === CONSTANT.EVENT.SESSION.LOGGED_IN &&
        subMessage.sessionStatus) {
        me.modalService.hide();
      }
    });

  };

  // ------   Component Logic / Public   ------ //
  public facebookSignUp = function() {
    var me = this;
    event.stopPropagation();
    this.facebookService.login().then((response: any) => {
      me.accountService.setFacebookDetails(response);
      me._createAccount();
    }, function(reason: any) {
      me.messagingService.show(
        'modal',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : 'An unexpected error has occurred'
      );
    });
  }

  public googleSignUp = function() {
    console.debug('SignupComponent::googleSignUp');
    var me = this;
    event.stopPropagation();
    this.googleService.login().then(response => {
      me.accountService.setGoogleDetails(response);
      me._createAccount();
    }, function(reason: any) {
      me.messagingService.show(
        'modal',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : 'An unexpected error has occurred'
      );
    });
  }

  public emailSignUp = function() {
    event.stopPropagation();
    this.isEmailSignUp = true;
  }

  public submitEmailDetails = function(isValid: boolean) {
    if(isValid) {
      this.accountService.setName(this.model.fullName);
      this.accountService.setPassword(this.model.password);
      this.accountService.setEmail(this.model.email);
      this._createAccount();
    }
  }

  private _createAccount() {
    console.debug('SignupComponent::_createAccount');
    var me = this;
    this.accountService.createAccount().then(function(response: string) {
      let responseBody = JSON.parse(response._body);
      me.accountService.setAkAccessToken(responseBody.token);
      me.accountService.setLoggedIn(true);
    }, function(reason: any) {
      me.accountService.setLoggedIn(false);
      me.messagingService.show(
        'modal',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : 'An unexpected error has occurred'
      );
    });
  }

};
