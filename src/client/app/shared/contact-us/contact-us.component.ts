import {
  Component,
  OnInit,
  OnDestroy,
  Input
}                             from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
}                             from '@angular/forms';

import { MessagingService }   from '../../services/messaging.service';
import { RestService }        from '../../services/rest.service';
import { SettingsService }    from '../../services/settings.service';
import { ValidationService }  from '../../services/validation.service';

import { CONSTANT }           from '../../core/constant';

/**
 * This class represents the contact us component
 *
 * This is used to let users send us emails
 */
@Component({
  moduleId: module.id,
  selector: 'ak-contact-us',
  templateUrl: 'contact-us.component.html',
  styleUrls: ['contact-us.component.css']
})

export class ContactUsComponent {

  public contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messagingService: MessagingService,
    private restService: RestService,
    private settingsService: SettingsService
  ) {
    this.contactForm = this.fb.group({
      'name' : new FormControl('', [
        Validators.required,
        ValidationService.textInputValidator
      ]),
      'email': new FormControl('', [
        Validators.required,
        ValidationService.emailValidator
      ]),
      'message': new FormControl('', [
        Validators.required
      ])
    });
  };

  ngOnInit() {
  };

  ngOnDestroy() {
  };

  public submitForm(value: any) {
    var me = this;

    if(!this.contactForm.valid) {
      for (var i in this.contactForm.controls) {
        this.contactForm.controls[i].markAsTouched();
      }
      return;
    };

    this.restService.post(
      me.settingsService.getServerBaseUrl() + '/contact', {
        name: me.contactForm.controls['name'].value,
        email: me.contactForm.controls['email'].value,
        message: me.contactForm.controls['message'].value
      }
    ).then((response: any) => {
      let responseBody = response.json();
      me._clearForm();
      me.messagingService.show(
        'contact-us',
        CONSTANT.MESSAGING.SUCCESS,
        'Your message has been sent!',
        true
      );
    }, (reason: any) => {
      me.messagingService.show(
        'contact-us',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : 'An unexpected error has occurred',
        true
      );
    });
  };

  private _clearForm() {
    this.contactForm.reset()
  };

}
