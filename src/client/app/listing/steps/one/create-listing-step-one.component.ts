import {
  Component,
  ElementRef,
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

  @ViewChild('businessTypeSelect')
  public businessTypeElementRef: ElementRef;

  @ViewChild('businessSetupSelect')
  public businessSetupElementRef: ElementRef;

  @ViewChild('eventTypeSelect')
  public eventTypeElementRef: ElementRef;

  @ViewChild('dietRequirementsSelect')
  public dietRequirementsElementRef: ElementRef;

  // These objects consist of 'name' + 'id'
  private businessSetups: Array<any> = [];
  private businessTypes: Array<any> = [];
  private eventTypes: Array<any> = [];
  private dietRequirements: Array<any> = [];

  public stepOneForm: FormGroup;

  private value: any = {};

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
  };

  public nextStep() {
    this.createListingService.nextStep();
  };

  // Handlers for select / multiselect
  public selected(value: any): void {
    console.log('Selected value is: ', value);
  };

  public removed(value:any):void {
    console.log('Removed value is: ', value);
  };

  public refreshValue(value:any):void {
    this.value = value;
  };

};
