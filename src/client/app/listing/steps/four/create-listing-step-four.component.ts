import {
  Component,
  EventEmitter,
  Output
}                                    from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
}                                    from '@angular/forms';
import {
  LocalStorageService,
  SessionStorageService
}                                    from 'ng2-webstorage';
import { FormMessagesComponent }     from '../../../shared/form-messages/form-messages.component';
import { CreateListingService }      from '../../create-listing.service';
import { SettingsService }           from '../../../services/settings.service';
import { ValidationService }         from '../../../services/validation.service';
import { CONSTANT }                  from '../../../core/constant';

/**
 * This class represents the lazy loaded CreateListingComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-create-listing-step-four',
  templateUrl: 'create-listing-step-four.component.html'
})

export class CreateListingStepFourComponent {

  public stepFourForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private createListingService: CreateListingService,
    private localStorageService: LocalStorageService,
    private settingsService: SettingsService
  ) {
    this.stepFourForm = fb.group({
      'businessLogo': new FormControl('', [
          Validators.required
        ]),
      'businessCoverImage': [null],
      'businessAdditionalImages': [null],
      'businessDescription': new FormControl('', [
          Validators.required
        ])
    });
  };

  public submitForm(value: any) {
    debugger;
    if(this.stepFourForm.valid) {
      this.localStorageService.store(
        CONSTANT.LOCALSTORAGE.LISTING_STEP_FOUR,
        value
      );
      this._nextStep();
    } else {
      // user might have hit next button without completing
      // some mandatory fields - trigger validation ! :)
      for (var i in this.stepFourForm.controls) {
        this.stepFourForm.controls[i].markAsTouched();
      }
    }
  };

  public previousStep() {
    this.createListingService.previousStep();
  };

  private _nextStep() {
    this.createListingService.nextStep();
  };

};
