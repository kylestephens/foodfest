import {
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  ViewEncapsulation
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
  styleUrls: ['listings-description.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ListingsDescriptionComponent implements OnChanges, OnInit {

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

  ngOnChanges(changes: any) {
    if(changes.vendor && changes.vendor.currentValue) {
      this.editingVendor = changes.vendor.currentValue;
      this._restoreFormValues(this.editingVendor);
    }
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
