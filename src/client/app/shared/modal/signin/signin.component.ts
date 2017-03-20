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

  model = new LoginDetails();

  constructor(
    private accountService: AccountService,
    private facebookService: FacebookService,
    private googleService: GoogleService,
    private messagingService: MessagingService
  ) {};

  // TODO
  // $rootScope.$on(constants.event.session.LOGGED_IN,
  //   function(event, loggedIn) {
  //     if(loggedIn) {
  //       ModalService.hide();
  //     }
  //   }
  // );

  public facebookSignIn = function () {
    var me = this;
    event.stopPropagation();
    this.facebookService.login().then((response: any) => {
      me.accountService.setFacebookDetails(response);
      me._setupSession();
    }, function(reason: any) {
      me.modalService.hide();
    });
  }

  public googleSignIn = function () {
    var me = this;
    event.stopPropagation();
    this.googleService.login().then((response: any) => {
      me.accountService.setGoogleDetails(response);
      me._setupSession();
    }).catch((reason: string) => {
      me.modalService.hide();
    });
  }

  public submitEmailDetails = function(isValid: boolean) {
    event.stopPropagation();
    if(isValid) {
      this.accountService.setEmail(this.model.email);
      this.accountService.setPassword(this.model.password);
      this._setupSession();
    }
  }

  private _setupSession = function() {
    var me = this;
    this.accountService.login().then(function(response: any) {
      debugger;
      me.accountService.setName(response.data.firstname);
      me.accountService.setAkAccessToken(response.token);
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
