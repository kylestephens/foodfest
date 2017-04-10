import { Component }            from '@angular/core';
import { Subscription }         from 'rxjs/Subscription';
import { Message }              from '../../shared/model/message';
import { InboxService }         from './inbox.service';
import { AccountService}        from '../../services/account.service';
import { ModalService }         from '../../services/modal.service';
import { CONSTANT }             from '../../core/constant';
import { ConfirmDialog }        from '../../shared/model/confirmDialog';
import { ConfirmDialogService } from '../../services/confirm-dialog.service'

/**
 * This class represents the lazy loaded Inbox.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-inbox',
  templateUrl: 'inbox.component.html',
  styleUrls: ['inbox.component.css']
})

export class InboxComponent {
  messages: Message[];
  private subscription: Subscription;

  constructor(
    private inboxService: InboxService,
    private accountService: AccountService,
    private modalService: ModalService,
    private confirmDialogService: ConfirmDialogService
    ) {
      this.getMessages();

      this.subscription = confirmDialogService.dialogConfirmed.subscribe(
      confirmDialog => {
        if(confirmDialog.action && confirmDialog.action === 'deleteConversation') {
          this.inboxService.deleteConversation(confirmDialog.record.id).then(() => {
            this.modalService.hide();
            //instead of getMessages request just remove the conversation
            this.removeConversation(confirmDialog.record.id);
          })
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getMessages() {
    let params = (({ id }) => ({ id }))(this.accountService.getUser());
    this.inboxService.getMessages(params).then(messages => {
      this.messages = messages;
    });
  }

  removeConversation(messageId: number) {
    let index = this.messages.map(function(record) { return record.id; }).indexOf(messageId);
    if (index > -1) {
      this.messages.splice(index, 1);
    }
  }

  confirmDelete(event: any, message: Message) {
    let confirmDialog = new ConfirmDialog('Are you sure you want to delete the conversation with ' + message.name_to_show +'?', 'deleteConversation', message);
    this.modalService.show(CONSTANT.MODAL.CONFIRM, confirmDialog);
  }
}
