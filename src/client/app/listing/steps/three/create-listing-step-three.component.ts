import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
}                                          from '@angular/forms';
import {
  LocalStorageService,
  SessionStorageService
}                                          from 'ng2-webstorage';
import { SelectModule }                    from 'ng2-select';
import { CreateListingService }            from '../../create-listing.service';
import { ValidationService }               from '../../../services/validation.service';
import { CONSTANT }                        from '../../../core/constant';

/**
 * This class represents the lazy loaded CreateListingComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-create-listing-step-three',
  templateUrl: 'create-listing-step-three.component.html'
})

export class CreateListingStepThreeComponent {

  public stepThreeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private createListingService: CreateListingService,
    private localStorageService: LocalStorageService
  ) {
    this.stepThreeForm = fb.group({
      'facebookAddress': new FormControl('', [
        ValidationService.websiteValidator
      ]),
      'twitterAddress': new FormControl('', [
        ValidationService.websiteValidator
      ]),
      'instagramAddress': new FormControl('', [
        ValidationService.websiteValidator
      ]),
    });
  };

  ngOnInit() {
    var _formValues;
    if(this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.LISTING_STEP_THREE)) {
      // user might be returning from next step
      // restore values to fields to allow them to edit their data
      _formValues = this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.LISTING_STEP_THREE);
      this._restoreFormValues(_formValues);
    }
  };

  public submitForm(value: any) {
    debugger;
    if(this.stepThreeForm.valid) {
      this.localStorageService.store(
        CONSTANT.LOCALSTORAGE.LISTING_STEP_THREE,
        value
      );
      this._nextStep();
    } else {
      // user might have hit next button without completing
      // some mandatory fields - trigger validation ! :)
      for (var i in this.stepThreeForm.controls) {
        this.stepThreeForm.controls[i].markAsTouched();
      }
    }
  };

  public previousStep() {
    this.createListingService.previousStep();
  };

  private _nextStep() {
    this.createListingService.nextStep();
  };

  private _restoreFormValues(values: any) {
    if(values.facebookAddress) {
      this.stepThreeForm.controls['facebookAddress'].setValue(values.facebookAddress);
    }
    if(values.twitterAddress) {
      this.stepThreeForm.controls['twitterAddress'].setValue(values.twitterAddress);
    }
    if(values.instagramAddress) {
      this.stepThreeForm.controls['instagramAddress'].setValue(values.instagramAddress);
    }
  };

};
