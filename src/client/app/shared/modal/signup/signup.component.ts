import { Component }        from '@angular/core';
import { Subscription }     from 'rxjs/Subscription';

import { LoginDetails }     from '../../model/login-details';

import { AccountService }   from '../../../services/account.service';
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

  data: any;
  subscription: Subscription;
  subMessage: any;

  isEmailSignUp: boolean = false;
  recaptchaResponse: string = null;
  model = new LoginDetails();

  constructor(
    private accountService: AccountService,
    private googleService: GoogleService,
    private messagingService: MessagingService,
    private modalService: ModalService
  ) {
    var me = this;
    // subscribe to modal service messages
    this.subscription = this.modalService.getMessage().subscribe(subMessage => {
      console.debug('SignupComponent::subscription');
      if(subMessage.event && subMessage.event === CONSTANT.EVENT.MODAL.HIDE_MODAL) {
        me.isEmailSignUp = false;
      }
    });
  };

  // TODO
  // $rootScope.$on(constants.event.session.LOGGED_IN, function(event, loggedIn) {
  //   if(loggedIn) {
  //     ModalService.hide();
  //   }
  // });

  // ------   Component Logic / Public   ------ //
  public facebookSignUp = function() {
    // event.stopPropagation();
    // FacebookService.login().then(function(response) {
    //   AccountService.setFacebookDetails(response);
    //   _createAccount();
    // }, function(reason) {
    //   ModalService.hide();
    // });
  }

  public googleSignUp = function() {
    var me = this;
    event.stopPropagation();
    this.googleService.login().then(response => {
      debugger;
      me.accountService.setGoogleDetails(response);
      me._createAccount();
    }, function(reason) {
      me.modalService.hide();
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

  // ------   Component Logic / Private   ------ //
  private _createAccount() {
    var me = this;
    this.accountService.createAccount().then(function(response) {
      me.accountService.setAkAccessToken(response.token);
      me.accountService.setLoggedIn(true);
    }, function(reason) {
      me.accountService.setLoggedIn(false);
      me.messagingService.show(
        'modal',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : 'An unexpected error has occurred'
      );
    });
  }

};
