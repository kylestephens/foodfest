import { Component, OnDestroy, Input }  from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
}                                       from '@angular/forms';

import { ActivatedRoute,
         Params,
         Router }                      from '@angular/router';

import { AccountService }               from '../services/account.service';
import { MessagingService }             from '../services/messaging.service';
import { ValidationService }            from '../services/validation.service';

import { CONSTANT }                     from '../core/constant';

/**
 * This class represents reset password component.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-reset-password',
  templateUrl: 'reset-password.component.html',
  styleUrls: ['reset-password.component.css']
})

export class ResetPasswordComponent {
  public resetPasswordForm: FormGroup;

  private token: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private messagingService: MessagingService,
    private validationService: ValidationService,
    public router: Router
  ) {
    this.resetPasswordForm = fb.group({
      'newPassword': new FormControl('', [
        Validators.required,
        ValidationService.passwordValidator
      ]),
      'confirmPassword': new FormControl('', [
        Validators.required,
        ValidationService.passwordValidator
      ])
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => this.token = params.token
    );

    if(!this.token) {
       this.router.navigate(['']);
    }
  }

  public submitForm(value: any) {
    event.stopPropagation();
    if(this.resetPasswordForm.valid) {
      if(value.newPassword !== value.confirmPassword) {
        this.messagingService.show(
          'reset-password',
          CONSTANT.MESSAGING.ERROR,
          'Your new passwords did not match. Please try again.'
        );
      }
      else {
        let params = {
          password: value.newPassword,
          token: this.token
        }
        this.resetPassword(params);
      }
    } else {
      for (let i in this.resetPasswordForm.controls) {
        this.resetPasswordForm.controls[i].markAsTouched();
      }
    }
  }

  private resetPassword(params: any) {
    this.accountService.resetPassword(params).then(
    (response: any) => {
      this.router.navigate(['']);

      //give time for redirect to work before showing message
      setTimeout(() => {
        this.messagingService.show(
          'global',
          CONSTANT.MESSAGING.SUCCESS,
          'Your password has been changed successfully',
          true
        );
      }, 300);
    },
    (reason: any) => {
      let reasonMsg: string = reason.json().msg ? reason.json().msg : null,
          messageText: string = reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR;

      if(reasonMsg && reasonMsg === CONSTANT.response_key.error.user.login.NOT_EXIST) messageText = 'Seams you haven\'t requested to change your password. Try reseting your password first.';
      else if(reasonMsg && reasonMsg === CONSTANT.response_key.error.PASSWORD.RESET_EXPIRED) messageText = '24 hours to reset your password have expired. Try reseting your password again.';

      this.messagingService.show(
        'reset-password',
        CONSTANT.MESSAGING.ERROR,
        messageText
      );
    });
  }

}
