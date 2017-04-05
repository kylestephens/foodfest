import { Component, OnDestroy } from '@angular/core';
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
  styleUrls: ['../signup/signup.component.css']
})

export class SigninComponent {

  private accountSubscription: Subscription;
  private firstName: string = '';
  private lastName: string = '';
  private loggedIn: boolean = false;

  model = new LoginDetails();

  constructor(
    private accountService: AccountService,
    private facebookService: FacebookService,
    private googleService: GoogleService,
    private messagingService: MessagingService,
    private modalService: ModalService
  ) {

    if(this.accountService.isLoggedIn()) {
      this.firstName = this.accountService.getUser().firstName;
    }

    // subscribe to account service messages
    this.accountSubscription = this.accountService.getMessage().subscribe(subMessage => {
      console.debug('SignupComponent::accountSubscription');
      if(subMessage.event && subMessage.event === CONSTANT.EVENT.SESSION.LOGGED_IN && subMessage.sessionStatus) {
        this.modalService.hide();
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

  public submitEmailDetails = function(isValid: boolean) {
    event.stopPropagation();
    if(isValid) {
      this.accountService.setEmailDetails(this.model);
      this._setupSession();
    }
  };

  private _setupSession = function() {
    this.accountService.login().then(
      (response: any) => {},
      (reason: any) => {
        this.messagingService.show(
          'modal',
          CONSTANT.MESSAGING.ERROR,
          reason.statusText ? reason.statusText : 'An unexpected error has occurred'
        );
      }
    );
  };

}
