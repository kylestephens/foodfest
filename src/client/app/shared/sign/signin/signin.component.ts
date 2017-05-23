import { Component, OnDestroy, Input }  from '@angular/core';
import { Router }                       from '@angular/router';
import { Http, Response }               from '@angular/http';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
}                                       from '@angular/forms';
import { Subscription }                 from 'rxjs/Subscription';
import 'rxjs/add/operator/toPromise';

import { AccountService }               from '../../../services/account.service';
import { FacebookService }              from '../../../services/facebook.service';
import { GoogleService }                from '../../../services/google.service';
import { MessagingService }             from '../../../services/messaging.service';
import { ModalService }                 from '../../../services/modal.service';
import { ValidationService }            from '../../../services/validation.service';

import { CONSTANT }                     from '../../../core/constant';

/**
 * This class represents the sign in component.
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
  private loggedIn: boolean = false;

  public isEmailSignIn: boolean = false;
  public signInForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private facebookService: FacebookService,
    private googleService: GoogleService,
    private messagingService: MessagingService,
    private modalService: ModalService,
    private validationService: ValidationService,
    public router: Router
  ) {

    this.signInForm = fb.group({
      'userEmail' : new FormControl('', [
          Validators.required,
          ValidationService.emailValidator
        ]),
      'userPassword': new FormControl('', [
          Validators.required,
          ValidationService.passwordValidator
        ])
    });

    this.modalSubscription = this.modalService.getMessage().subscribe(subMessage => {
      console.debug('SigninComponent::modalSubscription');
      if(subMessage.event && this.location === 'modal' && subMessage.event === CONSTANT.EVENT.MODAL.HIDE_MODAL) {
        this.isEmailSignIn = false;
        this.signInForm.controls['userEmail'].setValue('');
        this.signInForm.controls['userPassword'].setValue('');
        for (let i in this.signInForm.controls) {
          this.signInForm.controls[i].markAsUntouched();
        }
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
          if(this.accountService.redirectUrl.indexOf('?') > -1) {
            let redirectUrlArray = this.accountService.redirectUrl.split('?');
            let redirectParams = redirectUrlArray[1].split('&');

            let queryParams: { [key: string]: string } = { };

            for(let redirectParam of redirectParams) {
              let paramArray: any[] = redirectParam.split('=');
              queryParams[paramArray[0]] = paramArray [1];
            }
            this.router.navigate([redirectUrlArray[0]], { queryParams: queryParams });
          }
          else {
            this.router.navigate([this.accountService.redirectUrl]);
          }
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
        this.messagingService.show(
          'signin',
          CONSTANT.MESSAGING.ERROR,
          reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR,
          true
        );
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
      (reason: any) => {
        this.messagingService.show(
          'signin',
          CONSTANT.MESSAGING.ERROR,
          reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR,
          true
        );
      }
    );
  };

  public emailSignIn = function() {
    event.stopPropagation();
    this.isEmailSignIn = true;
  }

  public submitForm(value: any) {
    event.stopPropagation();
    if(this.signInForm.valid) {
      this.accountService.setEmailDetails({
        email: this.signInForm.controls['userEmail'].value,
        password: this.signInForm.controls['userPassword'].value
      });
      this._setupSession();
    } else {
      for (var i in this.signInForm.controls) {
        this.signInForm.controls[i].markAsTouched();
      }
    }
  };

  public signUp() {
    if(this.location === 'page'){
      this.router.navigate(['/signup']);
    }
    else if(this.location === 'modal') {
      this.modalService.show(CONSTANT.MODAL.SIGN_UP);
    }
  }

  public forgotPassword() {
    if(this.location === 'page') {
      this.router.navigate(['/forgot-password']);
    }
    else if(this.location === 'modal') {
      this.modalService.show(CONSTANT.MODAL.FORGOT_PASSWORD);
    }
  }

  private _setupSession = function() {
    this.accountService.login().then(
      (response: any) => {},
      (reason: any) => {
        let reasonMsg: string = reason.json().msg ? reason.json().msg : null,
           messageText: string = reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR;

        if(reasonMsg && reasonMsg === CONSTANT.response_key.error.user.login.NOT_EXIST) messageText = 'User with provided email does not exist';
        else if(reasonMsg && reasonMsg === CONSTANT.response_key.error.user.login.INVALID_PASSWORD) messageText = 'Invalid password';

        this.messagingService.show(
          'signin',
          CONSTANT.MESSAGING.ERROR,
          messageText
        );
      }
    );
  };

}
