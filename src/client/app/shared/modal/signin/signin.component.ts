import { Component }        from '@angular/core';
import { Http, Response }   from '@angular/http';
import 'rxjs/add/operator/toPromise';

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
  selector: 'signin',
  templateUrl: 'signin.component.html',
  styleUrls: ['../signup/signup.component.css']
})

export class SigninComponent {

  private modalSubscription: Subscription;
  private accountSubscription: Subscription;
  private firstName: string = '';
  private lastName: string = '';
  private avatar: string = '';
  private loggedIn: boolean = false;

  model = new LoginDetails();

  constructor(
    private accountService: AccountService,
    private facebookService: FacebookService,
    private googleService: GoogleService,
    private messagingService: MessagingService,
    private modalService: ModalService
  ) {
    var me = this;

    this.loggedIn = this.accountService.isLoggedIn();

    if(this.loggedIn) {
      me.firstName = me.accountService.getFirstName();
      me.avatar = me.accountService.getProfilePictureUrl();
    }

    // subscribe to account service messages
    this.accountSubscription = this.accountService.getMessage().subscribe(subMessage => {
      console.debug('SignupComponent::accountSubscription');
      if(subMessage.event && subMessage.event === CONSTANT.EVENT.SESSION.LOGGED_IN &&
        subMessage.sessionStatus) {
        me.modalService.hide();
      }
    });
  };

  public facebookSignIn = function () {
    var me = this;
    event.stopPropagation();
    this.facebookService.login().then((response: any) => {
      me.accountService.setFacebookDetails(response);
      me._setupSession();
    }, function(reason: any) {
      me.modalService.hide();
    });
  };

  public googleSignIn = function () {
    var me = this;
    event.stopPropagation();
    this.googleService.login().then((response: any) => {
      me.accountService.setGoogleDetails(response);
      me._setupSession();
    }).catch((reason: string) => {
      me.modalService.hide();
    });
  };

  public submitEmailDetails = function(isValid: boolean) {
    event.stopPropagation();
    if(isValid) {
      this.accountService.setEmail(this.model.email);
      this.accountService.setPassword(this.model.password);
      this._setupSession();
    }
  };

  private _setupSession = function() {
    var me = this;
    this.accountService.login().then(function(response: any) {
      let responseBody = JSON.parse(response._body);
      me.accountService.setName(responseBody.firstname);
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
  };

};
