import { Component, Input }         from '@angular/core';
import { Subscription }             from 'rxjs/Subscription';
import { Market } 			            from '../../shared/model/market';
import { AccountService }           from '../../services/account.service';
import { InboxService }             from '../../services/inbox.service';
import { ModalService }             from '../../services/modal.service';
import { ConfirmDialogService }     from '../../services/confirm-dialog.service';
import { MessagingService }         from '../../services/messaging.service';

import { ConfirmDialog }            from '../../shared/model/confirmDialog';
import { CONSTANT }                 from '../../core/constant';

@Component({
  moduleId: module.id,
  selector: 'ak-market-card',
  templateUrl: 'market-card.component.html',
  styleUrls: ['market-card.component.css'],
})

export class MarketCardComponent {
	@Input()
	market: Market;

  private subscription: Subscription;
  private SEND_MSG_ACTION = 'sendMessage';

  constructor(
    private accountService: AccountService,
    private modalService: ModalService,
    private confirmDialogService: ConfirmDialogService,
    private inboxService: InboxService,
    private messagingService: MessagingService
  ) {
    this.subscription = this.confirmDialogService.dialogConfirmed.subscribe(
    confirmDialog => {
      if(confirmDialog.action && confirmDialog.action === this.SEND_MSG_ACTION) {
        this.sendMessageConfirmed(confirmDialog.message, confirmDialog.record);
      }
    });
  };

   ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  sendMessage(market: Market) {
    if(!this.accountService.isLoggedIn()) {
      this.showErrorMessage();
      return;
    }

    this.accountService.userIsActiveVendor().then(isActiveVendor => {
      if(isActiveVendor) {
         let record = { receiver: market.organized_by, sender: this.accountService.getUser().id, market: market.id },
             confirmDialog = new ConfirmDialog(null, this.SEND_MSG_ACTION, record);
         this.modalService.show(CONSTANT.MODAL.SEND_MSG, confirmDialog);
      }
      else {
        this.showErrorMessage();
      }
    })
  }

  showErrorMessage() {
   this.messagingService.show(
      'global',
       CONSTANT.MESSAGING.ERROR,
      'You have to be a vendor to send a message'
    );
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

    this.inboxService.createMessage(params, 'market-card').then( message => {
      debugger
    });//TODO: handle error and success
  }

}
