import {
  Component,
  OnInit,
  ViewChild
}                                    from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
}                                    from '@angular/forms';
import { SelectModule }              from 'ng2-select';
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
  selector: 'ak-create-listing-step-one',
  templateUrl: 'create-listing-step-one.component.html'
})

export class CreateListingStepOneComponent {

  // These objects consist of 'name' + 'id'
  private businessSetups: Array<any> = [];
  private businessTypes: Array<any> = [];
  private eventTypes: Array<any> = [];
  private dietRequirements: Array<any> = [];

  public stepOneForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private createListingService: CreateListingService,
    private settingsService: SettingsService
  ) {
    this.stepOneForm = fb.group({
      'businessName' : new FormControl('', [
          Validators.required,
          ValidationService.alphaNumericValidator
        ]),
      'businessType': [null, Validators.required],
      'businessSetup': [null, Validators.required],
      'eventType': [null, Validators.required],
      'dietRequirements': [null]
    });
  };

  ngOnInit() {
    this.businessSetups = this.settingsService.getBusinessSetups();
    this.businessTypes = this.settingsService.getBusinessTypes();
    this.eventTypes = this.settingsService.getEventTypes();
    this.dietRequirements = this.settingsService.getDietRequirements();
  };

  public submitForm(value: any) {
    console.log(value);
    if(this.stepOneForm.valid) {
      this._nextStep();
    }
  };

  private _nextStep() {
    this.createListingService.nextStep();
  };

};
