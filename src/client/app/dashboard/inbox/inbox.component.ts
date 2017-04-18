import { Component, OnInit }    from '@angular/core';
import { Subscription }         from 'rxjs/Subscription';
import { Message }              from '../../shared/model/message';
import { InboxService }         from './inbox.service';
import { AccountService}        from '../../services/account.service';
import { ModalService }         from '../../services/modal.service';
import { CONSTANT }             from '../../core/constant';
import { ConfirmDialog }        from '../../shared/model/confirmDialog';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { User }                 from '../../shared/model/user';
import { Vendor }               from '../../shared/model/vendor';

//TODO: add mobile site
/**
 * This class represents the lazy loaded Inbox.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-inbox',
  templateUrl: 'inbox.component.html',
  styleUrls: ['inbox.component.css']
})

export class InboxComponent implements OnInit {
  conversations: Message[];
  openConversation: Message;
  private subscription: Subscription;

  constructor(
    private inboxService: InboxService,
    private accountService: AccountService,
    private modalService: ModalService,
    private confirmDialogService: ConfirmDialogService
    ) { }

  ngOnInit() {
    this.getConversations();

    this.subscription = this.confirmDialogService.dialogConfirmed.subscribe(
    confirmDialog => {
      if(confirmDialog.action && confirmDialog.action === 'deleteConversation') {
        this.inboxService.deleteConversation(confirmDialog.record.last_msg_id).then(() => {
          this.modalService.hide();
          //instead of getConversations request just remove the conversation
          this.removeConversation(confirmDialog.record.id);
        })
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private removeConversation(messageId: number) {
    let index = this.conversations.map(function(record) { return record.id; }).indexOf(messageId);
    if (index > -1) {
      this.conversations.splice(index, 1);
    }
    //if first conversation is removed, new open conversation is next in the list
    if(index === 0) {
      this.openConversation = this.conversations[0];
      this.openConversation.is_read = true;
    }
  }

  getConversations() {
    let params = (({ id }) => ({ id }))(this.accountService.getUser());
    this.inboxService.getConversations(params).then(conversations => {
      this.conversations = conversations;
      this.openConversation = this.conversations[0];
      this.openConversation.is_read = true;
    });
  }

  confirmDelete(event: any, conversation: Message) {
    event.stopPropagation();
    let confirmDialog = new ConfirmDialog('Are you sure you want to delete the conversation with ' + conversation.name_to_show +'?', 'deleteConversation', conversation);
    this.modalService.show(CONSTANT.MODAL.CONFIRM, confirmDialog);
  }

  changeConversation(event: any, conversation: Message) {
    this.openConversation = conversation;
    this.openConversation.is_read = true;
  }

}
