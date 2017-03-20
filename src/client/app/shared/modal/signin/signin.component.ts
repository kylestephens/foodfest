import { Component }        from '@angular/core';
import { Http, Response }   from '@angular/http';
import 'rxjs/add/operator/toPromise';

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
  selector: 'signin',
  templateUrl: 'signin.component.html',
  styleUrls: ['../signup/signup.component.css']
})

export class SigninComponent {

  model = new LoginDetails();

  constructor(
    private accountService: AccountService,
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
    //event.stopPropagation();
    // FacebookService.login().then(function(response) {
    //   AccountService.setFacebookDetails(response);
    //   _setupSession();
    // }, function(reason) {
    //   ModalService.hide();
    // });
  }

  public googleSignIn = function () {
    event.stopPropagation();
    this.googleService.login().then((response: any) => {
      this.accountService.setGoogleDetails(response);
      this._setupSession();
    }).catch((reason: string) => {
      this.modalService.hide();
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
      me.accountService.setName(response.data.name);
      me.accountService.setListrAccessToken(response.token);
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
