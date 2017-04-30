import { Component, OnDestroy, Input } from '@angular/core';
import { Router }                 from '@angular/router';
import { Http, Response }       from '@angular/http';
import { Subscription }         from 'rxjs/Subscription';
import 'rxjs/add/operator/toPromise';

import { LoginDetails }         from '../../model/login-details';

import { AccountService }       from '../../../services/account.service';
import { FacebookService }      from '../../../services/facebook.service';
import { GoogleService }        from '../../../services/google.service';
import { MessagingService }     from '../../../services/messaging.service';
import { ModalService }         from '../../../services/modal.service';

import { CONSTANT }             from '../../../core/constant';

/**
 * This class represents the navigation bar component.
 *
 * TODO: handle scenario where account doesn't exist yet better
 *
 */
@Component({
  moduleId: module.id,
  selector: 'signin',
  templateUrl: 'signin.component.html',
  styleUrls: ['../signup.component.css']
})

export class SigninComponent {
  @Input()
  location: string;

  private modalSubscription: Subscription;
  private accountSubscription: Subscription;
  private firstName: string = '';
  private lastName: string = '';
  private loggedIn: boolean = false;

  isEmailSignIn: boolean = false;
  model = new LoginDetails();

  constructor(
    private accountService: AccountService,
    private facebookService: FacebookService,
    private googleService: GoogleService,
    private messagingService: MessagingService,
    private modalService: ModalService,
    public router: Router
  ) {

    if(this.accountService.isLoggedIn()) {
      this.firstName = this.accountService.getUser().firstName;
    }

    this.modalSubscription = this.modalService.getMessage().subscribe(subMessage => {
      console.debug('SigninComponent::modalSubscription');
      if(subMessage.event && this.location === 'modal' && subMessage.event === CONSTANT.EVENT.MODAL.HIDE_MODAL) {
        this.isEmailSignIn = false;
      }
    });


    // subscribe to account service messages
    this.accountSubscription = this.accountService.getMessage().subscribe(subMessage => {
      console.debug('SigninComponent::accountSubscription');
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
    this.accountSubscription.unsubscribe();
  };

  public facebookSignIn = function () {
    event.stopPropagation();
    this.facebookService.login().then(
      (response: any) => {
        this.accountService.setFacebookDetails(response);
        this._setupSession();
      },
      (reason: any) => {
        this.modalService.hide();
      }
    );
  };

  public googleSignIn = function () {
    event.stopPropagation();
    this.googleService.login().then(
      (response: any) => {
        this.accountService.setGoogleDetails(response);
        this._setupSession();
      },
      (reason: string) => {
        this.modalService.hide();
      }
    );
  };

  public emailSignIn = function() {
    event.stopPropagation();
    this.isEmailSignIn = true;
  }

  public submitEmailDetails = function(isValid: boolean) {
    event.stopPropagation();
    if(isValid) {
      this.accountService.setEmailDetails(this.model);
      this._setupSession();
    }
  };

  signUp() {
    if(this.location === 'page'){
      this.router.navigate(['/signup']);
    }
    else if(this.location === 'modal') {
      this.modalService.show(CONSTANT.MODAL.SIGN_UP);
    }
  }

  private _setupSession = function() {
    this.accountService.login().then(
      (response: any) => {},
      (reason: any) => {
        this.messagingService.show(
          'signin',
          CONSTANT.MESSAGING.ERROR,
          reason.statusText ? reason.statusText : 'An unexpected error has occurred'
        );
      }
    );
  };

}
