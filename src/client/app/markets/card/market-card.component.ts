import { Component, Input, OnInit } from '@angular/core';
import { Subscription }             from 'rxjs/Subscription';
import { Market } 			            from '../../shared/model/market';
import { AccountService }           from '../../services/account.service';
import { InboxService }             from '../../services/inbox.service';
import { ModalService }             from '../../services/modal.service';
import { ConfirmDialogService }     from '../../services/confirm-dialog.service';

import { ConfirmDialog }            from '../../shared/model/confirmDialog';
import { CONSTANT }                 from '../../core/constant';

@Component({
  moduleId: module.id,
  selector: 'ak-market-card',
  templateUrl: 'market-card.component.html',
  styleUrls: ['market-card.component.css'],
})

export class MarketCardComponent implements OnInit {
	@Input()
	market: Market;

  isVendor: boolean;
  private subscription: Subscription;
  private SEND_MSG_ACTION = 'sendMessage';

  constructor(
    private accountService: AccountService,
    private modalService: ModalService,
    private confirmDialogService: ConfirmDialogService,
    private inboxService: InboxService
  ) {
    this.subscription = this.confirmDialogService.dialogConfirmed.subscribe(
    confirmDialog => {
      if(confirmDialog.action && confirmDialog.action === this.SEND_MSG_ACTION) {
        this.sendMessageConfirmed(confirmDialog.message, confirmDialog.record);
      }
    });
  };

  ngOnInit(): void {
    this.setUserDetails();
  }

   ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setUserDetails() {
    this.isVendor = (this.accountService.getUser().user_type === CONSTANT.user.types.VENDOR.code) ? true : false;
  }

  sendMessage(market: Market) {
    let record = { receiver: market.organized_by, sender: this.accountService.getUser().id, market: market.id },
        confirmDialog = new ConfirmDialog(null, this.SEND_MSG_ACTION, record);
    this.modalService.show(CONSTANT.MODAL.SEND_MSG, confirmDialog);
  }

  sendMessageConfirmed(message: string, record: any) {
    //TODO: handle send confirmation and adjust messaging
     let params = {
        sender_id: record.sender,
        receiver_id: record.receiver,
        market_id: record.market,
        //vendor_id: this.vendor.id,
        content: message
      }

    this.inboxService.createMessage(params).then( message => {
      debugger
    });//TODO: handle error and success
  }

}
