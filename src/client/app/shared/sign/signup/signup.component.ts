import { Component, OnDestroy, Input }    from '@angular/core';
import { Router }                 from '@angular/router';
import { Subscription }           from 'rxjs/Subscription';

import { LoginDetails }           from '../../model/login-details';

import { AccountService }         from '../../../services/account.service';
import { FacebookService }        from '../../../services/facebook.service';
import { GoogleService }          from '../../../services/google.service';
import { MessagingService }       from '../../../services/messaging.service';
import { ModalService }           from '../../../services/modal.service';

import { CONSTANT }               from '../../../core/constant';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'signup',
  templateUrl: 'signup.component.html',
  styleUrls: ['../signup.component.css']
})

export class SignupComponent {
  @Input()
  location: string;

  private modalSubscription: Subscription;
  private accountSubscription: Subscription;

  isEmailSignUp: boolean = false;
  recaptchaResponse: string = null;
  model = new LoginDetails();

  constructor(
    private accountService: AccountService,
    private facebookService: FacebookService,
    private googleService: GoogleService,
    private messagingService: MessagingService,
    private modalService: ModalService,
    public router: Router
  ) {
    // subscribe to modal service messages
    this.modalSubscription = this.modalService.getMessage().subscribe(subMessage => {
      console.debug('SignupComponent::modalSubscription');
      if(subMessage.event && this.location === 'modal' && subMessage.event === CONSTANT.EVENT.MODAL.HIDE_MODAL) {
        this.isEmailSignUp = false;
      }
    });

    // subscribe to account service messages
    this.accountSubscription = this.accountService.getMessage().subscribe(subMessage => {
      console.debug('SignupComponent::accountSubscription');
      if(subMessage.event && subMessage.event === CONSTANT.EVENT.SESSION.LOGGED_IN && accountService.isLoggedIn()) {
        if(this.location === 'modal') {
          this.modalService.hide();
        }
        else if(this.location === 'page') {
          this.router.navigate([this.accountService.redirectUrl]);
          this.accountService.redirectUrl = '';
        }
      }
    });
  };

  ngOnDestroy() {
    this.modalSubscription.unsubscribe();
    this.accountSubscription.unsubscribe();
  };

  // ------   Component Logic / Public   ------ //
  public facebookSignUp = function() {
    event.stopPropagation();
    this.facebookService.login().then(
      (response: any) => {
        this.accountService.setFacebookDetails(response);
        this._createAccount();
      },
      (reason: any) => {
        this.messagingService.show(
          'signup',
          CONSTANT.MESSAGING.ERROR,
          reason.statusText ? reason.statusText : 'An unexpected error has occurred'
        );
      }
    );
  }

  public googleSignUp = function() {
    console.debug('SignupComponent::googleSignUp');
    event.stopPropagation();
    this.googleService.login().then(
      (response: any) => {
        this.accountService.setGoogleDetails(response);
        this._createAccount();
      },
      (reason: any) => {
        this.messagingService.show(
          'signup',
          CONSTANT.MESSAGING.ERROR,
          reason.statusText ? reason.statusText : 'An unexpected error has occurred',
          true
        );
      }
    );
  }

  public emailSignUp = function() {
    event.stopPropagation();
    this.isEmailSignUp = true;
  }

  public submitEmailDetails = function(isValid: boolean) {
    if(isValid) {
      this.accountService.setEmailDetails(this.model);
      this._createAccount();
    }
  }

  signIn() {
    if(this.location === 'page'){
      this.router.navigate(['/signin']);
    }
    else if(this.location === 'modal') {
      this.modalService.show(CONSTANT.MODAL.SIGN_IN);
    }
  }

  private _createAccount() {
    console.debug('SignupComponent::_createAccount');
    this.accountService.createAccount().then(
      (response: any) => {},
      (reason: any) => {
        this.messagingService.show(
          'signup',
          CONSTANT.MESSAGING.ERROR,
          reason.statusText ? reason.statusText : 'An unexpected error has occurred'
        );
      }
    );
  }

}
