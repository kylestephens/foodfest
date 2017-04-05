import { Component, OnInit }         from '@angular/core';
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

export class CreateListingStepOneComponent implements OnInit {

  // These objects consist of 'name' + 'id'
  private styles: Array<any> = [];
  private businessSetups: Array<any> = [];
  private businessTypes: Array<any> = [];
  private eventTypes: Array<any> = [];
  private dietRequirements: Array<any> = [];

  public stepOneForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private createListingService: CreateListingService,
    private localStorageService: LocalStorageService,
    private settingsService: SettingsService
  ) {
    this.stepOneForm = fb.group({
      'businessName' : new FormControl('', [
          Validators.required,
          ValidationService.textInputValidator
        ]),
      'businessType': [null, Validators.required],
      'businessSetup': [null, Validators.required],
      'eventType': [null, Validators.required],
      'styles': [null],
      'dietRequirements': [null]
    });
  };

  ngOnInit() {
    var _formValues;
    this._initDropdowns();
    if(this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.LISTING_STEP_ONE)) {
      // user might be returning from next step
      // restore values to fields to allow them to edit their data
      _formValues = this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.LISTING_STEP_ONE);
      this._restoreFormValues(_formValues);
    }
  };

  public submitForm(value: any) {
    if(this.stepOneForm.valid) {
      this.localStorageService.store(
        CONSTANT.LOCALSTORAGE.LISTING_STEP_ONE,
        value
      );
      this._nextStep();
    } else {
      // user might have hit next button without completing
      // some mandatory fields - trigger validation ! :)
      for (var i in this.stepOneForm.controls) {
        this.stepOneForm.controls[i].markAsTouched();
      }
    }
  };

  private _nextStep() {
    this.createListingService.nextStep();
  };

  private _initDropdowns() {
    this.styles = this.settingsService.getStyles();
    this.businessSetups = this.settingsService.getBusinessSetups();
    this.businessTypes = this.settingsService.getBusinessTypes();
    this.eventTypes = this.settingsService.getEventTypes();
    this.dietRequirements = this.settingsService.getDietRequirements();
  };

  private _restoreFormValues(values: any) {
    if(values.styles) {
      this.stepOneForm.controls['styles'].setValue(values.styles);
    }
    if(values.businessName) {
      this.stepOneForm.controls['businessName'].setValue(values.businessName);
    }
    if(values.businessType) {
      this.stepOneForm.controls['businessType'].setValue(values.businessType);
    }
    if(values.businessSetup) {
      this.stepOneForm.controls['businessSetup'].setValue(values.businessSetup);
    }
    if(values.eventType) {
      this.stepOneForm.controls['eventType'].setValue(values.eventType);
    }
    if(values.dietRequirements) {
      this.stepOneForm.controls['dietRequirements'].setValue(values.dietRequirements);
    }
  };

};
