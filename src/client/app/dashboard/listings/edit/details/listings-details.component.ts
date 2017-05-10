import {
  Component,
  Input,
  AfterViewInit,
  ElementRef,
  NgZone,
  OnChanges,
  OnInit,
  ViewChild,
  ViewEncapsulation
}                                        from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
}                                        from '@angular/forms';

import { CONSTANT }                      from '../../../../core/constant';

import { Vendor }                        from '../../../../shared/model/vendor';

import { AccountService }                from '../../../../services/account.service';
import { MessagingService }              from '../../../../services/messaging.service';
import { RestService }                   from '../../../../services/rest.service';
import { SettingsService }               from '../../../../services/settings.service';
import { ValidationService }             from '../../../../services/validation.service';

import { AgmCoreModule, MapsAPILoader }  from 'angular2-google-maps/core';
import { SelectModule }                  from 'ng2-select';

declare var google: any;

/**
 * This class represents the lazy loaded listing edits component
 */
@Component({
  moduleId: module.id,
  selector: 'ak-listings-details',
  templateUrl: 'listings-details.component.html',
  styleUrls: ['listings-details.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ListingsDetailsComponent implements AfterViewInit, OnInit, OnChanges {

  @Input()
  vendor: Vendor;

  public editingVendor: Vendor;
  public listingsDetailsForm: FormGroup;

  public addressInfo: any;
  public latitude: number;
  public longitude: number;

  @ViewChild('mapsAutocomplete')
  public placesElementRef: ElementRef;

  // These objects consist of 'name' + 'id'
  private styles: Array<any> = [];
  private businessSetups: Array<any> = [];
  private businessTypes: Array<any> = [];
  private eventTypes: Array<any> = [];
  private dietRequirements: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private accountService: AccountService,
    private messagingService: MessagingService,
    private restService: RestService,
    private settingsService: SettingsService,
    private validationService: ValidationService
  ) {
    this.listingsDetailsForm = this.fb.group({
      'businessName' : new FormControl('', [
          Validators.required,
          ValidationService.textInputValidator
        ]),
      'businessType': [null, Validators.required],
      'businessSetup': [null],
      'eventType': [null, Validators.required],
      'styles': [null],
      'dietRequirements': [null],
      'phoneNumber' : new FormControl('', [
          Validators.required,
          ValidationService.phoneNumberValidator
        ]),
      'businessAddress': [null],
      'businessWebsite': [null],
      'facebookAddress': new FormControl('', [
        ValidationService.websiteValidator
      ]),
      'twitterAddress': new FormControl('', [
        ValidationService.websiteValidator
      ]),
      'instagramAddress': new FormControl('', [
        ValidationService.websiteValidator
      ])
    });
  };

  ngOnInit() {
    this.editingVendor = this.vendor;
    this._initDropdowns();
    this._restoreFormValues(this.editingVendor);
  };

  ngAfterViewInit() {
    var me = this;

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(me.placesElementRef.nativeElement);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          let place = google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          me.listingsDetailsForm.controls['businessAddress'].setValue(me.placesElementRef.nativeElement.value);
          me.addressInfo = place;
        });
      });
    });
  };

  ngOnChanges(changes: any) {
    if(changes.vendor && changes.vendor.currentValue) {
      this.editingVendor = changes.vendor.currentValue;
      this._restoreFormValues(this.editingVendor);
    }
  };

  public submitForm(value: any) {
    var me = this;

    if(this.addressInfo) {
      if (typeof this.addressInfo.geometry.location.lat == 'function') {
        this.editingVendor.business_latitude = this.addressInfo.geometry.location.lat();
        this.editingVendor.business_longitude = this.addressInfo.geometry.location.lng();
      } else {
        this.editingVendor.business_latitude = this.addressInfo.geometry.location.lat;
        this.editingVendor.business_longitude = this.addressInfo.geometry.location.lng;
      }
    }

    this.restService.post(
      me.settingsService.getServerBaseUrl() + '/vendors/edit', {
        id: me.editingVendor.id,
        business_name:       me.listingsDetailsForm.controls['businessName'].value,
        business_website:    me.listingsDetailsForm.controls['businessWebsite'].value,
        business_address:    me.listingsDetailsForm.controls['businessAddress'].value,
        business_latitude:   me.editingVendor.business_latitude,
        business_longitude:  me.editingVendor.business_longitude,
        facebook_address:    me.listingsDetailsForm.controls['facebookAddress'].value,
        twitter_address:     me.listingsDetailsForm.controls['twitterAddress'].value,
        instagram_address:   me.listingsDetailsForm.controls['instagramAddress'].value,
        business_type:       me.listingsDetailsForm.controls['businessType'].value,
        phone_num:           me.listingsDetailsForm.controls['phoneNumber'].value,
        event_types:         me.listingsDetailsForm.controls['eventType'].value,
        business_setup:      me.listingsDetailsForm.controls['businessSetup'].value,
        styles:              me.listingsDetailsForm.controls['styles'].value,
        diet_requirements:   me.listingsDetailsForm.controls['dietRequirements'].value,
        description:         me.vendor.description,
        listed_items:        me.vendor.listed_items
      }, this.accountService.getUser().akAccessToken
    ).then(function(response: any) {
      let responseBody = response.json();
      me.vendor['business_name']       = responseBody['business_name'];
      me.vendor['business_website']    = responseBody['business_website'];
      me.vendor['business_address']    = responseBody['business_address'];
      me.vendor['business_latitude']   = responseBody['business_latitude'];
      me.vendor['business_longitude']  = responseBody['business_longitude'];
      me.vendor['facebook_address']    = responseBody['facebook_address'];
      me.vendor['twitter_address']     = responseBody['twitter_address'];
      me.vendor['instagram_address']   = responseBody['instagram_address'];
      me.vendor['business_type']       = responseBody['business_type'];
      me.vendor['phone_num']           = responseBody['phone_num'];
      me.vendor['event_types']         = responseBody['event_types'];
      me.vendor['business_setup']      = responseBody['business_setup'][0];
      me.vendor['styles']              = responseBody['styles'];
      me.vendor['diet_requirements']   = responseBody['diet_requirements'];
      me.editingVendor                 = me.vendor;

      me._restoreFormValues(me.editingVendor);
      me.messagingService.show(
        'listings-details-edit',
        CONSTANT.MESSAGING.SUCCESS,
        'Your listing has been successfully updated',
        true
      );
    }, (reason: any) => {
      me.messagingService.show(
        'listings-details-edit',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : 'An unexpected error has occurred',
        true
      );
    });
  };

  private _initDropdowns() {
    this.styles           = this.settingsService.getStyles();
    this.businessSetups   = this.settingsService.getBusinessSetups();
    this.businessTypes    = this.settingsService.getBusinessTypes();
    this.eventTypes       = this.settingsService.getEventTypes();
    this.dietRequirements = this.settingsService.getDietRequirements();
  };

  private _restoreFormValues(editingVendor: Vendor) {
    if(editingVendor.business_name) {
      this.listingsDetailsForm.controls['businessName'].setValue(editingVendor.business_name);
    }
    if(editingVendor.business_type) {
      this.listingsDetailsForm.controls['businessType'].setValue(editingVendor.business_type);
    }
    if(editingVendor.business_setup) {
      this.listingsDetailsForm.controls['businessSetup'].setValue([editingVendor.business_setup]);
    }
    if(editingVendor.styles) {
      this.listingsDetailsForm.controls['styles'].setValue(editingVendor.styles);
    }
    if(editingVendor.event_types) {
      this.listingsDetailsForm.controls['eventType'].setValue(editingVendor.event_types);
    }
    if(editingVendor.diet_requirements) {
      this.listingsDetailsForm.controls['dietRequirements'].setValue(editingVendor.diet_requirements);
    }
    if(editingVendor.phone_num) {
      this.listingsDetailsForm.controls['phoneNumber'].setValue(editingVendor.phone_num);
    }
    if(editingVendor.business_address) {
      this.listingsDetailsForm.controls['businessAddress'].setValue(editingVendor.business_address);
    }
    if(editingVendor.business_website) {
      this.listingsDetailsForm.controls['businessWebsite'].setValue(editingVendor.business_website);
    }
    if(editingVendor.facebook_address) {
      this.listingsDetailsForm.controls['facebookAddress'].setValue(editingVendor.facebook_address);
    }
    if(editingVendor.twitter_address) {
      this.listingsDetailsForm.controls['twitterAddress'].setValue(editingVendor.twitter_address);
    }
    if(editingVendor.instagram_address) {
      this.listingsDetailsForm.controls['instagramAddress'].setValue(editingVendor.instagram_address);
    }
  };

}
