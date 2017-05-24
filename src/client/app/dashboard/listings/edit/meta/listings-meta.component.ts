import {
  Component,
  Input,
  OnInit,
  OnChanges,
  ViewChild
}                                        from '@angular/core';
import {
  Router
}                                        from '@angular/router';
import {
  LocalStorageService
}                                        from 'ng2-webstorage';

import { CONSTANT }                      from '../../../../core/constant';

import { Vendor }                        from '../../../../shared/model/vendor';

import { AccountService }                from '../../../../services/account.service';
import { MessagingService }              from '../../../../services/messaging.service';
import { RestService }                   from '../../../../services/rest.service';

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
  public totalAmount: number;

  constructor(
    private accountService: AccountService,
    private localStorageService: LocalStorageService,
    private messagingService: MessagingService,
    private restService: RestService,
    public router: Router
  ) {};

  ngOnInit() {
    this.editingVendor = this.vendor;

    if(!this.editingVendor.subscription) return;

    switch (this.editingVendor.subscription.plan_name) {
      case 'monthly':
        this.totalAmount = this.editingVendor.subscription.monthly_amount;
        break;
      case 'quarterly':
        this.totalAmount = this.editingVendor.subscription.monthly_amount * 3;
        break;
      case 'annual':
        this.totalAmount = this.editingVendor.subscription.monthly_amount * 12;
        break;
    }
  };

  ngOnChanges(changes: any) {
    if(changes.vendor && changes.vendor.currentValue) {
      this.editingVendor = changes.vendor.currentValue;
    }
  };

  public onClickPublishListing() {
    if(!this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.LISTING_STEP_FIVE)) {
      this._setupStorage();
    }
    this.router.navigate(['/list-with-us/payment/']);
  };

  /**
   * This is coupled with the structure of the setup listing form (especially Step-1). Sorry.
   * TODO: fix this post-launch
   */
  private _setupStorage() {
    this.localStorageService.store(CONSTANT.LOCALSTORAGE.LISTING_STEP_ONE, {
      businessName: this.editingVendor.business_name,
      businessType: this.editingVendor.business_type,
      businessSetup: this.editingVendor.business_setup,
      eventType: this.editingVendor.event_types,
      styles: this.editingVendor.styles,
      dietRequirements: this.editingVendor.diet_requirements
    });
    this.localStorageService.store(CONSTANT.LOCALSTORAGE.VENDOR_ID, this.editingVendor.id);
  };

}
