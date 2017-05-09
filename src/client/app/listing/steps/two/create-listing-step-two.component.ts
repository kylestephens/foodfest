import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  AfterViewInit,
  ViewChild,
  EventEmitter,
  Output
}                                         from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
}                                         from '@angular/forms';
import {
  LocalStorageService
}                                         from 'ng2-webstorage';
import { CreateListingService }           from '../../create-listing.service';
import { AgmCoreModule, MapsAPILoader }   from 'angular2-google-maps/core';
import { ValidationService }              from '../../../services/validation.service';
import { CONSTANT }                       from '../../../core/constant';

declare var google: any;

/**
 * This class represents the lazy loaded CreateListingComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-create-listing-step-two',
  templateUrl: 'create-listing-step-two.component.html'
})

export class CreateListingStepTwoComponent implements AfterViewInit {

  public latitude: number;
  public longitude: number;
  public addressDetails: any;

  @ViewChild('autocompleteSearch')
  public searchElementRef: ElementRef;

  public stepTwoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private createListingService: CreateListingService,
    private localStorageService: LocalStorageService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {
    this.stepTwoForm = fb.group({
      'phoneNumber' : new FormControl('', [
          Validators.required,
          ValidationService.phoneNumberValidator
        ]),
      'businessAddress': [null],
      'businessWebsite': [null]
    });
  };

  ngOnInit() {
    var _formValues;
    if(this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.LISTING_STEP_TWO)) {
      // user might be returning from next step
      // restore values to fields to allow them to edit their data
      _formValues = this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.LISTING_STEP_TWO);
      this._restoreFormValues(_formValues);
    }
  };

  ngAfterViewInit() {
    var me = this;

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(me.searchElementRef.nativeElement);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          let place = google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set address details
          me.stepTwoForm.controls['businessAddress'].setValue(
            me.searchElementRef.nativeElement.value
          );
          me.addressDetails = place;
        });
      });
    });
  };

  public submitForm(value: any) {
    if(this.stepTwoForm.valid) {
      this.localStorageService.store(
        CONSTANT.LOCALSTORAGE.LISTING_STEP_TWO,
        value
      );
      if(this.addressDetails) {
        this.localStorageService.store(
          CONSTANT.LOCALSTORAGE.LISTING_ADDRESS,
          this.addressDetails
        );
      }
      this._nextStep();
    } else {
      // user might have hit next button without completing
      // some mandatory fields - trigger validation ! :)
      for (var i in this.stepTwoForm.controls) {
        this.stepTwoForm.controls[i].markAsTouched();
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
    if(values.phoneNumber) {
      this.stepTwoForm.controls['phoneNumber'].setValue(values.phoneNumber);
    }
    if(values.businessAddress) {
      this.stepTwoForm.controls['businessAddress'].setValue(values.businessAddress);
    }
    if(values.businessWebsite) {
      this.stepTwoForm.controls['businessWebsite'].setValue(values.businessWebsite);
    }
  };

};
