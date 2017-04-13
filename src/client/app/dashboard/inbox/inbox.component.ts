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
//TODO: add dates formatting (db <-> fronted)
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
  messagesInConversation: Message[];
  userId: number = this.accountService.getUser().id;
  messageText: string;
  private subscription: Subscription;
  private inboxThread: HTMLElement;
  private inboxOverview: HTMLElement;
  private sideMenu: HTMLElement = <HTMLElement> document.getElementsByClassName('side-menu')[0];;

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

  ngAfterViewChecked() {
    let inboxThread:HTMLElement = <HTMLElement> document.getElementsByClassName('inbox-thread')[0],
        inboxOverview:HTMLElement = <HTMLElement> document.getElementsByClassName('inbox-container')[0],
        height = inboxThread.offsetHeight;

    if(height > inboxOverview.offsetHeight) {
      inboxOverview.style.height = height + 'px';
    }

    if(height > this.sideMenu.offsetHeight) {
      this.sideMenu.style.height = height + 'px';
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private removeConversation(messageId: number) {
    let index = this.conversations.map(function(record) { return record.id; }).indexOf(messageId);
    if (index > -1) {
      this.conversations.splice(index, 1);
    }
    //if first conversation is removed, fetch messages for the next one that is now first in the list
    if(index === 0) {
      this.getMessagesInConversation(this.conversations[0].id);
    }
  }

  getConversations() {
    let params = (({ id }) => ({ id }))(this.accountService.getUser());
    this.inboxService.getConversations(params).then(conversations => {
      this.conversations = conversations;
      //get messages in the latest conversation (first in the list)
      this.getMessagesInConversation(this.conversations[0].id);
    });
  }

  private getMessagesInConversation(conversationId: number) {
    this.inboxService.getMessagesInConversation(conversationId).then(messages => {
      this.messagesInConversation = messages;
    });
  }

  confirmDelete(event: any, conversation: Message) {
    event.stopPropagation();
    let confirmDialog = new ConfirmDialog('Are you sure you want to delete the conversation with ' + conversation.name_to_show +'?', 'deleteConversation', conversation);
    this.modalService.show(CONSTANT.MODAL.CONFIRM, confirmDialog);
  }

  //TODO: add for any selected conversation, for now hardcoded to first conversation
  sendMessage() {
    let params = {
        sender_id: this.accountService.getUser().id,
        receiver_id: this.conversations[0].sender.id === this.accountService.getUser().id ? this.conversations[0].receiver.id : this.conversations[0].sender.id,
        vendor_id: this.conversations[0].vendor.id,
        content: this.messageText,
        parent_message_id: this.conversations[0].last_msg_id
      }

    this.inboxService.createMessage(params).then( message => {
      this.messageText = null;
      this.messagesInConversation.unshift(message);
      this.conversations[0].content = message.content;
      this.conversations[0].send_date = message.send_date;
      this.conversations[0].last_msg_id = message.id;
    });
  }

  //TODO: add switching between conversations
}
