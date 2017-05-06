import { Component, OnInit }          from '@angular/core';
import { Location, PlatformLocation } from '@angular/common';
import { ActivatedRoute }             from '@angular/router';
import { Subscription }               from 'rxjs/Subscription';
import { Message }                    from '../../shared/model/message';
import { AccountService}              from '../../services/account.service';
import { ModalService }               from '../../services/modal.service';
import { CONSTANT }                   from '../../core/constant';
import { ConfirmDialog }              from '../../shared/model/confirmDialog';
import { ConfirmDialogService }       from '../../services/confirm-dialog.service';
import { BrowserService }             from '../../services/browser.service';
import { InboxService }               from '../../services/inbox.service';
import { SettingsService }            from '../../services/settings.service';
import { User }                       from '../../shared/model/user';
import { Vendor }                     from '../../shared/model/vendor';

/**
 * This class represents the lazy loaded Inbox.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-listings',
  templateUrl: 'listings.component.html',
  styleUrls: ['listings.component.css']
})

export class ListingsComponent {

  private vendors: Vendor[];
  private selectedVendor: Vendor;
  private vendorId: number;
  private showThread: boolean = false;
  private loaded: boolean = false;
  private browser: any = this.browserService.get();
  private isPhone: boolean = this.browser.deviceType === 'phone';
  private serverUrl: string = this.settingsService.getServerBaseUrl() + '/';

  constructor(
    private inboxService: InboxService,
    private accountService: AccountService,
    private modalService: ModalService,
    private confirmDialogService: ConfirmDialogService,
    private browserService: BrowserService,
    private location: Location,
    private route: ActivatedRoute,
    private platformLocation: PlatformLocation,
    private settingsService: SettingsService
  ) {
    platformLocation.onPopState(() => {
      this.clearListingsParameters();
    });
  }

  ngOnInit() {
    this.getListings();

    this.route.params.subscribe(
      params => this.vendorId = params['id']
    );
  }

  public getListings() {
    this.accountService.getVendors().then((vendors: Array<Vendor>) => {
      this.loaded = true;
      this.vendors = vendors;

      if(this.vendors.length > 0 && this.isPhone) {
        this.setInboxForPhone();
      }
      else if(this.vendors.length > 0) {
        this.setInbox();
      }
    });
  }

  public changeVendor(event: any, vendor: Vendor) {
    if(!this.selectedVendor || this.selectedVendor.id !== vendor.id) {
      this.selectedVendor = vendor;
      if(!this.isPhone) this.location.replaceState('/dashboard/listings/' + this.selectedVendor.id);
    }

    if(this.isPhone) {
      if(!this.vendorId) {
        this.location.go('/dashboard/listings/' + this.selectedVendor.id);
      }
      else {
        this.location.replaceState('/dashboard/listings/' + this.selectedVendor.id);
      }
      window.document.getElementsByClassName('page-body')[0].scrollIntoView();
      this.showThread = true;
    }
  }

  private clearListingsParameters() {
    if(this.isPhone) {
      this.showThread = false;
      this.selectedVendor = null;
      this.vendorId = null;
      window.document.getElementsByClassName('page-body')[0].scrollIntoView();
    }
  }

  private setInbox() {
    if(this.vendorId) {
      this.selectedVendor = this.vendors.filter(vendor => {
        return vendor.id === +this.vendorId;
      })[0];
    }
    if(!this.selectedVendor) this.selectedVendor = this.vendors[0];
    if(!this.vendorId) this.location.replaceState('/dashboard/listings/' + this.selectedVendor.id);
  }

  private setInboxForPhone() {
    if(this.vendorId) {
      this.selectedVendor = this.vendors.filter(vendor => {
        return vendor.id === +this.vendorId;
      })[0];

      if(this.selectedVendor) {
        this.showThread = true;
      } else {
        this.location.replaceState('/dashboard/listings');
      }
    }
  }

}
