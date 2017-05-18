import {
  Component,
  Input,
  OnChanges,
  OnInit,
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

import { SelectModule }                  from 'ng2-select';

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

export class ListingsDetailsComponent implements OnInit, OnChanges {

  @Input()
  vendor: Vendor;

  public editingVendor: Vendor;

  public listingsDetailsForm: FormGroup;

  // These objects consist of 'name' + 'id'
  private styles: Array<any> = [];
  private businessSetups: Array<any> = [];
  private businessTypes: Array<any> = [];
  private eventTypes: Array<any> = [];
  private dietRequirements: Array<any> = [];

  constructor(
    private fb: FormBuilder,
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

  ngOnChanges(changes: any) {
    if(changes.vendor && changes.vendor.currentValue) {
      this.editingVendor = changes.vendor.currentValue;
      this._restoreFormValues(this.editingVendor);
    }
  };

  public submitForm(value: any) {
    var me = this;
    this.restService.post(
      me.settingsService.getServerBaseUrl() + '/vendors/edit', {
        id: me.editingVendor.id,
        business_name: me.listingsDetailsForm.controls['businessName'].value,
        business_website: me.listingsDetailsForm.controls['businessWebsite'].value,
        business_address: me.listingsDetailsForm.controls['businessAddress'].value,
        business_latitude: me.listingsDetailsForm.controls['businessName'].value,
        business_longitude: me.listingsDetailsForm.controls['businessName'].value,
        facebook_address: me.listingsDetailsForm.controls['facebookAddress'].value,
        twitter_address: me.listingsDetailsForm.controls['twitterAddress'].value,
        instagram_address: me.listingsDetailsForm.controls['instagramAddress'].value,
        business_type: me.listingsDetailsForm.controls['businessType'].value,
        phone_number: me.listingsDetailsForm.controls['phoneNumber'].value,
        event_type: me.listingsDetailsForm.controls['eventType'].value,
        business_setup: me.listingsDetailsForm.controls['businessSetup'].value,
        styles: me.listingsDetailsForm.controls['styles'].value,
        diet_requirements: me.listingsDetailsForm.controls['dietRequirements'].value,
        description: me.vendor.description,
        listed_items: me.vendor.listed_items
      }, this.accountService.getUser().akAccessToken
    ).then(function(response: any) {
      let responseBody = response.json();
      me.vendor['business_name'] = responseBody['business_name'];
      me.vendor['business_website'] = responseBody['business_website'];
      me.vendor['business_address'] = responseBody['business_address'];
      me.vendor['business_latitude'] = responseBody['business_latitude'];
      me.vendor['business_longitude'] = responseBody['business_longitude'];
      me.vendor['facebook_address'] = responseBody['facebook_address'];
      me.vendor['twitter_address'] = responseBody['twitter_address'];
      me.vendor['instagram_address'] = responseBody['instagram_address'];
      me.vendor['business_type'] = responseBody['business_type'];
      me.vendor['phone_number'] = responseBody['phone_number'];
      me.vendor['event_types'] = responseBody['event_types'];
      me.vendor['business_setup'] = responseBody['business_setup'];
      me.vendor['styles'] = responseBody['styles'];
      me.vendor['diet_requirements'] = responseBody['diet_requirements'];
      me.editingVendor = me.vendor;
      me._restoreFormValues(me.editingVendor);
    }, (reason: any) => {
      me.messagingService.show(
        'listings-edit',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : 'An unexpected error has occurred',
        true
      );
    });
  };

  private _initDropdowns() {
    this.styles = this.settingsService.getStyles();
    this.businessSetups = this.settingsService.getBusinessSetups();
    this.businessTypes = this.settingsService.getBusinessTypes();
    this.eventTypes = this.settingsService.getEventTypes();
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
    if(editingVendor.phone_number) {
      this.listingsDetailsForm.controls['phoneNumber'].setValue(editingVendor.phone_number);
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