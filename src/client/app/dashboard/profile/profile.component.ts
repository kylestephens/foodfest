import { Component }           from '@angular/core';
import { Response }            from '@angular/http';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
}                              from '@angular/forms';

import { Vendor }              from '../../shared/model/vendor';
import { AccountService }      from '../../services/account.service';
import { MessagingService }    from '../../services/messaging.service';
import { RestService }         from '../../services/rest.service';
import { SettingsService }     from '../../services/settings.service';
import { ValidationService }   from '../../services/validation.service';

import { CONSTANT }          from '../../core/constant';

/**
 * This class represents the lazy loaded Profile Component.
 * This sits in the Dashboard.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css']
})

export class ProfileComponent {

  private loaded: boolean = false;
  private user: any;

  public profileEditForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private messagingService: MessagingService,
    private restService: RestService,
    private settingsService: SettingsService
  ) {
    this.user = this.accountService.getUser();
    this.profileEditForm = this.fb.group({
      'emailAddress': new FormControl(this.user.email, [
        Validators.required,
        ValidationService.textInputValidator
      ]),
      'firstName': new FormControl(this.user.firstname, [
        Validators.required,
        ValidationService.textInputValidator
      ]),
      'lastName': new FormControl(this.user.lastname, [
        Validators.required,
        ValidationService.textInputValidator
      ])
    });
  };

  ngOnInit(): void {
    if(this.accountService.isLoggedIn()) {
      this.setup();
    }
  };

  public submitForm(value: any) {
    var me = this;

    this.restService.post(
      me.settingsService.getServerBaseUrl() + '/users/edit', {
        emailAddress:       me.profileEditForm.controls['emailAddress'].value,
        firstName:          me.profileEditForm.controls['firstName'].value,
        lastName:           me.profileEditForm.controls['lastName'].value
      }, this.accountService.getUser().akAccessToken
    ).then((response: any) => {
      let responseBody = response.json();
      this.user.firstname = responseBody.firstName;
      this.user.lastname = responseBody.lastName;
      this.user.email = responseBody.emailAddress;
      this.accountService.updateUser(this.user);

      me.messagingService.show(
        'profile-edit',
        CONSTANT.MESSAGING.SUCCESS,
        'Your listing has been successfully updated',
        true
      );
    }, (reason: any) => {
      me.messagingService.show(
        'profile-edit',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : 'An unexpected error has occurred',
        true
      );
    });
  };

  setup(): void {
    this.loaded = true;
  };

}
