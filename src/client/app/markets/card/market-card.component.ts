import { Component,
         Input,
         SimpleChanges }            from '@angular/core';
import { Subscription }             from 'rxjs/Subscription';
import { Market } 			            from '../../shared/model/market';
import { Vendor }                   from '../../shared/model/vendor';
import { AccountService }           from '../../services/account.service';
import { ModalService }             from '../../services/modal.service';
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
  @Input()
  action: string;
  @Input()
  vendors: Vendor[];

  constructor(
    private accountService: AccountService,
    private modalService: ModalService,
    private messagingService: MessagingService
  ) {};

   ngOnChanges(changes: SimpleChanges) {
    if(changes.vendors.currentValue && (!changes.vendors.previousValue || changes.vendors.currentValue.lenght !== changes.vendors.previousValue.length)) {
      this.vendors = changes.vendors.currentValue;
    }
  }

  openConfirmationDialog(market: Market) {
    if(!this.accountService.isLoggedIn()) {
      this.showErrorMessage();
      return;
    }

    if(this.vendors.length > 0) {
       let record = { receiver: market.organized_by, sender: this.accountService.getUser().id, market: market.id, vendors: this.vendors },
           confirmDialog = new ConfirmDialog(null, this.action, record);
       this.modalService.show(CONSTANT.MODAL.SEND_MSG, confirmDialog);
    }
    else {
      this.showErrorMessage();
    }
  }

  showErrorMessage() {
   this.messagingService.show(
      'global',
       CONSTANT.MESSAGING.ERROR,
      'You have to be a vendor to send a message',
      true
    );
  }
}
