import { Component, OnInit }     from '@angular/core';
import { Subscription }          from 'rxjs/Subscription';
import { MarketService }         from './market.service';
import { InboxService }          from '../services/inbox.service';
import { AccountService }        from '../services/account.service';
import { ConfirmDialogService }  from '../services/confirm-dialog.service';
import { Market }                from '../shared/model/market';
import { Vendor }                from '../shared/model/vendor';
//TODO: handle till loaded, and no markets
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
  isVendor: boolean;
  SEND_MSG_ACTION = 'sendMessage';

  private subscription: Subscription;

  constructor(
    private marketService: MarketService,
    private accountService: AccountService,
    private confirmDialogService: ConfirmDialogService,
    private inboxService: InboxService
  ) {
    this.subscription = this.confirmDialogService.dialogConfirmed.subscribe(
    confirmDialog => {
      debugger
      if(confirmDialog.action && confirmDialog.action === this.SEND_MSG_ACTION) {
        this.sendMessageConfirmed(confirmDialog.message, confirmDialog.record);
      }
    });
  }

  ngOnInit(): void {
    this.getMarkets();
    this.getUserVendors();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getMarkets(): void {
    this.marketService.getMarkets().then(markets => {
      this.loaded = true;
      this.markets = markets;
    });//TODO: handle error
  }

  getUserVendors() {
    this.accountService.getUserVendors().then((vendors: Vendor[]) => {
      this.vendors = vendors;
    });
  }

  sendMessageConfirmed(message: string, record: any) {
    debugger
    //TODO: handle send confirmation and adjust messaging
     let params = {
        sender_id: record.sender,
        receiver_id: record.receiver,
        market_id: record.market,
        vendor_id: record.selectedVendor.id,
        content: message
      }

    this.inboxService.createMessage(params, 'send-message').then( message => {
      debugger
    });//TODO: handle error and success
  }
}
