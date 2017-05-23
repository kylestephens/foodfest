import {
  Component,
  Input,
  OnInit,
  OnChanges,
  ViewChild
}                                        from '@angular/core';
import {
  FormArray,
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

/**
 * This class represents the lazy loaded listing edits component
 */
@Component({
  moduleId: module.id,
  selector: 'ak-listings-meta',
  templateUrl: 'listings-meta.component.html',
  styleUrls: ['listings-meta.component.css']
})

export class ListingsMetaComponent implements OnInit, OnChanges {

  @Input()
  vendor: Vendor;

  public editingVendor: Vendor;
  public listingsMetaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private messagingService: MessagingService,
    private restService: RestService,
    private settingsService: SettingsService,
    private validationService: ValidationService
  ) {
    this.listingsMetaForm = this.fb.group({
      'businessDescription': new FormControl('', [
        Validators.required
      ])
    });
  };

  ngOnInit() {
    this.editingVendor = this.vendor;
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
        business_name:       me.vendor.business_name,
        business_website:    me.vendor.business_website,
        business_address:    me.vendor.business_address,
        business_latitude:   me.vendor.business_latitude,
        business_longitude:  me.vendor.business_longitude,
        facebook_address:    me.vendor.facebook_address,
        twitter_address:     me.vendor.twitter_address,
        instagram_address:   me.vendor.instagram_address,
        business_type:       me.vendor.business_type,
        phone_num:           me.vendor.phone_num,
        event_types:         me.vendor.event_types,
        business_setup:      me.vendor.business_setup,
        styles:              me.vendor.styles,
        diet_requirements:   me.vendor.diet_requirements,
        description:         me.listingsMetaForm.controls['businessDescription'].value,
        listed_items:        me.listingsMetaForm.controls['listingItems'].value
      }, this.accountService.getUser().akAccessToken
    ).then((response: any) => {
      let responseBody = response.json();
      me.vendor['description']   = responseBody['description'] ? responseBody['description'] : '';
      me.editingVendor = me.vendor;

      me.messagingService.show(
        'listings-description-edit',
        CONSTANT.MESSAGING.SUCCESS,
        'Your listing has been successfully updated',
        true
      );
    }, (reason: any) => {
      me.messagingService.show(
        'listings-description-edit',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : 'An unexpected error has occurred',
        true
      );
    });
  };

  private _restoreFormValues(editingVendor: Vendor) {
    if(editingVendor.description) {
      this.listingsMetaForm.controls['businessDescription'].setValue(editingVendor.description);
    }
  };

}
