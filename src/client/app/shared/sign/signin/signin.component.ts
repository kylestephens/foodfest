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
