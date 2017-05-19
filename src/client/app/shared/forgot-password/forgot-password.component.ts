import { Component, Input }             from '@angular/core';
import { Router }                       from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
}                                       from '@angular/forms';

import { AccountService }               from '../../services/account.service';
import { SettingsService }              from '../../services/settings.service';
import { MessagingService }             from '../../services/messaging.service';
import { ModalService }                 from '../../services/modal.service';
import { ValidationService }            from '../../services/validation.service';

import { CONSTANT }                     from '../../core/constant';

/**
 * This class represents the forgot password
 */
@Component({
  moduleId: module.id,
  selector: 'forgot-password',
  templateUrl: 'forgot-password.component.html',
  styleUrls: ['forgot-password.component.css']
})

export class ForgotPasswordComponent {
  @Input()
  location: string;

  public forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private settingService: SettingsService,
    private messagingService: MessagingService,
    private modalService: ModalService,
    private validationService: ValidationService,
    public router: Router
  ) {

    this.forgotPasswordForm = fb.group({
      'email': new FormControl('', [
        Validators.required,
        ValidationService.emailValidator
      ])
    });
  }

  public submitForm(value: any) {
    event.stopPropagation();
    if(this.forgotPasswordForm.valid) {
      let params = {
        email: value.email,
        url: this.settingService.getBaseUrl() + '/reset-password'
      }
      this.accountService.forgotPassword(params).then(
        (response: any) => {
          if(this.location === 'modal') {
           this.modalService.hide();
          }
          else {
            this.router.navigate(['/']);
          }

          //give time for redirect to work before showing message
          setTimeout(() => {
            this.messagingService.show(
              'global',
              CONSTANT.MESSAGING.SUCCESS,
              'A link to reset your password has been sent to ' + value.email,
              true
            );
          }, 300);
        },
        (reason: any) => {
          let reasonMsg: string = reason.json().msg ? reason.json().msg : null,
             messageText: string = reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR;

          if(reasonMsg && reasonMsg === CONSTANT.response_key.error.user.login.NOT_EXIST) messageText = 'User with provided email does not exist';

          this.messagingService.show(
            'forgot-password',
            CONSTANT.MESSAGING.ERROR,
            messageText
          );
        }
      );
    } else {
      for (let i in this.forgotPasswordForm.controls) {
        this.forgotPasswordForm.controls[i].markAsTouched();
      }
    }
  };
}
