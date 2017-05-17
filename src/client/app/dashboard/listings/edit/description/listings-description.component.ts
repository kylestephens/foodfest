import {
  Component,
  Input,
  OnInit,
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
  selector: 'ak-listings-description',
  templateUrl: 'listings-description.component.html',
  styleUrls: ['listings-description.component.css']
})

export class ListingsDescriptionComponent implements OnInit {

  @Input()
  vendor: Vendor;

  public editingVendor: Vendor;
  public listingsDescriptionForm: FormGroup;

  public itemType: string = 'Menu';
  public itemTitleExample: string = 'Pizza Margherita';
  public itemDescriptionExample: string = 'Fresh Basil, Cubed Italian mozzarella, Grated parmesan';

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private messagingService: MessagingService,
    private restService: RestService,
    private settingsService: SettingsService,
    private validationService: ValidationService
  ) {
    this.listingsDescriptionForm = this.fb.group({
      'businessDescription': new FormControl('', [
        Validators.required
      ]),
      'listingItems': this.fb.array([
        this._initItem()
      ])
    });
  };

  ngOnInit() {
    this.editingVendor = this.vendor;
    this._restoreFormValues(this.editingVendor);
  };

  public onClickAddItem() {
    let controls = (<FormArray>this.listingsDescriptionForm.controls['listingItems']).controls;
    let count = controls.length;
    if(controls[count - 1].get('item_title').value == '') {
      controls[count - 1].get('item_title').markAsTouched();
    } else {
      (<FormArray>this.listingsDescriptionForm.controls['listingItems']).push(
        this._initItem()
      );
    }
  };

  public onClickRemoveItem(index: number) {
    (<FormArray>this.listingsDescriptionForm.controls['listingItems']).removeAt(index);
    if((<FormArray>this.listingsDescriptionForm.controls['listingItems']).length === 0) {
      (<FormArray>this.listingsDescriptionForm.controls['listingItems']).push(
        this._initItem()
      );
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
        description:         me.listingsDescriptionForm.controls['businessDescription'].value,
        listed_items:        me.listingsDescriptionForm.controls['listingItems'].value
      }, this.accountService.getUser().akAccessToken
    ).then((response: any) => {
      let responseBody = response.json();
      me.vendor['description']   = responseBody['description'] ? responseBody['description'] : '';
      me.vendor['listed_items']  = responseBody['listed_items'] ? responseBody['listed_items'] : [];
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

  private _initItem(value?: any) {
    return this.fb.group({
      item_title: new FormControl('', [
        Validators.required
      ]),
      item_description: new FormControl('', [])
    });
  };

  private _restoreFormValues(editingVendor: Vendor) {
    if(editingVendor.description) {
      this.listingsDescriptionForm.controls['businessDescription'].setValue(editingVendor.description);
    }
    if(editingVendor.listed_items) {
      this._restoreListItemsValues(editingVendor.listed_items);
    }
  };

  private _restoreListItemsValues(values: any) {
    if(values.length > 0) {
      for(var i = 0; i < values.length; i++) {
        (<FormArray>this.listingsDescriptionForm.controls['listingItems']).push(
          this.fb.group({
            item_title: new FormControl(values[i].item_title, [
              Validators.required
            ]),
            item_description: new FormControl(values[i].item_description, [])
          })
        );
      }
      (<FormArray>this.listingsDescriptionForm.controls['listingItems']).removeAt(0);
    }
  };

}
