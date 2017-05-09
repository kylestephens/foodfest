import { Component, OnDestroy, Input }    from '@angular/core';
import { Router }                         from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
}                                         from '@angular/forms';
import { Subscription }                   from 'rxjs/Subscription';

import { AccountService }                 from '../../../services/account.service';
import { FacebookService }                from '../../../services/facebook.service';
import { GoogleService }                  from '../../../services/google.service';
import { MessagingService }               from '../../../services/messaging.service';
import { ModalService }                   from '../../../services/modal.service';
import { ValidationService }              from '../../../services/validation.service';

import { CONSTANT }                       from '../../../core/constant';

/**
 * This class represents the sign up component.
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

  public isEmailSignUp: boolean = false;
  public recaptchaResponse: string = null;
  public signUpForm: FormGroup;

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

    this.signUpForm = fb.group({
      'userName' : new FormControl('', [
        Validators.required,
        ValidationService.alphaNumericValidator
      ]),
      'userEmail' : new FormControl('', [
        Validators.required,
        ValidationService.emailValidator
      ]),
      'userPassword': new FormControl('', [
        Validators.required,
        ValidationService.passwordValidator
      ])
    });

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
          reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR
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
          reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR,
          true
        );
      }
    );
  }

  public emailSignUp = function() {
    event.stopPropagation();
    this.isEmailSignUp = true;
  }

  public submitForm(value: any) {
    event.stopPropagation();
    if(this.signUpForm.valid) {
      this.accountService.setEmailDetails({
        fullName: this.signUpForm.controls['userName'].value,
        email: this.signUpForm.controls['userEmail'].value,
        password: this.signUpForm.controls['userPassword'].value
      });
      this._createAccount();
    } else {
      for (var i in this.signUpForm.controls) {
        this.signUpForm.controls[i].markAsTouched();
      }
    }
  };

  public signIn() {
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
      (response: any) => {
        if(response.msg && response.msg === CONSTANT.response_key.warning.user.sign_up.EXISTS) {
          this.messagingService.show(
            'global',
            CONSTANT.MESSAGING.WARNING,
            'This account already exists, next time log in',
            true
          );
        }
      },
      (reason: any) => {
        let reasonMsg: string = reason.json().msg ? reason.json().msg : null,
           messageText: string = reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR;

        if(reasonMsg && reasonMsg === CONSTANT.response_key.error.user.login.INVALID_PASSWORD) messageText = 'Invalid password';

        this.messagingService.show(
          'signup',
          CONSTANT.MESSAGING.ERROR,
          messageText
        );
      }
    );
  }

}
