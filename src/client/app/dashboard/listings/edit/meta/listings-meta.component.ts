import {
  Component,
  Input,
  OnDestroy,
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
import { Subscription }                  from 'rxjs/Subscription';

import { CONSTANT }                      from '../../../../core/constant';

import { ConfirmDialog }                 from '../../../../shared/model/confirmDialog';
import { Vendor }                        from '../../../../shared/model/vendor';

import { AccountService }                from '../../../../services/account.service';
import { ConfirmDialogService }          from '../../../../services/confirm-dialog.service';
import { LoaderService }                 from '../../../../services/loader.service';
import { MessagingService }              from '../../../../services/messaging.service';
import { ModalService }                  from '../../../../services/modal.service';
import { RestService }                   from '../../../../services/rest.service';
import { SettingsService }               from '../../../../services/settings.service';

/**
 * This class represents the lazy loaded listing edits component
 */
@Component({
  moduleId: module.id,
  selector: 'ak-listings-meta',
  templateUrl: 'listings-meta.component.html',
  styleUrls: ['listings-meta.component.css']
})

export class ListingsMetaComponent implements OnDestroy, OnInit, OnChanges {

  @Input()
  vendor: Vendor;

  public editingVendor: Vendor;
  public totalAmount: number;

  private UNSUBSCRIBE_PAYMENT_ACTION = 'unsubscribePayment';
  private subscription: Subscription;

  constructor(
    private accountService: AccountService,
    private confirmDialogService: ConfirmDialogService,
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService,
    private messagingService: MessagingService,
    private modalService: ModalService,
    private restService: RestService,
    private settingsService: SettingsService,
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

    this.subscription = this.confirmDialogService.dialogConfirmed.subscribe((confirmDialog) => {
      if(confirmDialog.action && confirmDialog.action === this.UNSUBSCRIBE_PAYMENT_ACTION) {
        this.loaderService.show();

        this.restService.post(
          this.settingsService.getServerBaseUrl() + '/account/unsubscribe', {
            vendorId: this.editingVendor.id
          },
          this.accountService.getUser().akAccessToken
        ).then((resp: any) => {
          this.loaderService.hide();
          this.modalService.hide();
          this.editingVendor.active_vendor = false;
          this.vendor = this.editingVendor;
          this.accountService.updateVendor(this.vendor);
        }, (reason: any) => {
          this.loaderService.hide();
          this.modalService.hide();
          this.messagingService.show(
            'listings-edit',
            CONSTANT.MESSAGING.ERROR,
            reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR
          );
        });
      }
    });
  };

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  };

  ngOnChanges(changes: any) {
    if(changes.vendor && changes.vendor.currentValue) {
      this.editingVendor = changes.vendor.currentValue;
    }
  };

  /**
   * This is coupled with the structure of the setup listing form. Sorry.
   * TODO: fix this post-launch
   */
  public onClickPublishListing() {
    if(!this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.LISTING_STEP_FIVE)) {
      this._setupStorage();
    }
    this.router.navigate(['/list-with-us/payment/']);
  };

  public onClickUnpublishListing() {
    event.stopPropagation();
    let confirmDialog = new ConfirmDialog(`
      Are you sure you want to unsubscribe?

      Your payment subscription will be cancelled and your listing will be removed immediately.`,
      this.UNSUBSCRIBE_PAYMENT_ACTION, this.editingVendor.id
    );
    this.modalService.show(CONSTANT.MODAL.CONFIRM, confirmDialog);
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
