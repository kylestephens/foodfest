import { Component, OnInit }     from '@angular/core';
import { Subscription }          from 'rxjs/Subscription';
import { MarketService }         from './market.service';
import { InboxService }          from '../services/inbox.service';
import { AccountService }        from '../services/account.service';
import { ConfirmDialogService }  from '../services/confirm-dialog.service';
import { ModalService }          from '../services/modal.service';
import { Market }                from '../shared/model/market';
import { Vendor }                from '../shared/model/vendor';
import { CONSTANT }              from '../core/constant';
import { LoaderService }         from '../services/loader.service';

/**
 * This class represents the lazy loaded Markets component.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-markets',
  templateUrl: 'markets.component.html',
  styleUrls: ['markets.component.css']
})
export class MarketsComponent implements OnInit {
  markets: Market[];
  vendors: Vendor[];
  loaded: boolean = false;
  isLoggedIn: boolean = this.accountService.isLoggedIn();
  isVendor: boolean;
  SEND_MSG_ACTION = 'sendMessage';

  private subscriptions: Subscription[] = [];

  constructor(
    private marketService: MarketService,
    private accountService: AccountService,
    private confirmDialogService: ConfirmDialogService,
    private inboxService: InboxService,
    private modalService: ModalService,
    private loaderService: LoaderService
  ) {
    this.subscriptions.push(this.accountService.getMessage().subscribe(subMessage => {
      if(subMessage.event === CONSTANT.EVENT.SESSION.LOGGED_IN) {
        this.isLoggedIn = this.accountService.isLoggedIn();
      }

      if(subMessage.event === CONSTANT.EVENT.SESSION.LOGGED_IN || subMessage.event === CONSTANT.EVENT.SESSION.USER_TYPE) {
        if(this.accountService.isLoggedIn()) {
           this.getUserVendors();
        }
      }
    }));

    this.subscriptions.push(this.confirmDialogService.dialogConfirmed.subscribe(
    confirmDialog => {
      if(confirmDialog.action && confirmDialog.action === this.SEND_MSG_ACTION) {
        this.sendMessageConfirmed(confirmDialog.message, confirmDialog.record);
      }
    }));
  }

  ngOnInit(): void {
    this.getMarkets();
    if(this.accountService.isLoggedIn()) {
       this.getUserVendors();
    }
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  getMarkets(): void {
    this.loaderService.show();
    this.marketService.getMarkets().then(markets => {
      if(markets) {
        this.loaded = true;
        this.markets = markets;
      }
      this.loaderService.hide();
    });
  }

  getUserVendors() {
    this.accountService.getUserVendors().then((vendors: Vendor[]) => {
      this.vendors = vendors;
    });
  }

  sendMessageConfirmed(message: string, record: any) {
    this.loaderService.show();
    let params = {
      sender_id: record.sender,
      receiver_id: record.receiver,
      market_id: record.market,
      vendor_id: record.selectedVendor.id,
      content: message
    }

    this.inboxService.createMessage(params, 'global').then( message => {
      this.modalService.hide();
      this.loaderService.hide();
    });
  }

  pageChanged() {
    window.document.getElementsByClassName('page-body')[0].scrollIntoView();
  }
}
