import { Component, OnInit }          from '@angular/core';
import { Location, PlatformLocation } from '@angular/common';
import { ActivatedRoute }             from '@angular/router';
import { Subscription }               from 'rxjs/Subscription';
import { InboxService }               from './inbox.service';
import { Message }                    from '../../shared/model/message';
import { AccountService}              from '../../services/account.service';
import { ModalService }               from '../../services/modal.service';
import { CONSTANT }                   from '../../core/constant';
import { ConfirmDialog }              from '../../shared/model/confirmDialog';
import { ConfirmDialogService }       from '../../services/confirm-dialog.service';
import { BrowserService }             from '../../services/browser.service';
import { User }                       from '../../shared/model/user';
import { Vendor }                     from '../../shared/model/vendor';


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
  private conversations: Message[];
  private openConversation: Message;
  private conversationId: number;
  private showThread: boolean = false;
  private loaded: boolean = false;
  private subscription: Subscription;
  private browser: any = this.browserService.get();
  private isPhone: boolean = this.browser.deviceType === 'phone';

  constructor(
    private inboxService: InboxService,
    private accountService: AccountService,
    private modalService: ModalService,
    private confirmDialogService: ConfirmDialogService,
    private browserService: BrowserService,
    private location: Location,
    private route: ActivatedRoute,
    private platformLocation: PlatformLocation
    ) {
      platformLocation.onPopState(() => {
        this.clearInboxParameters();
      });
   }

  ngOnInit() {
    this.getConversations();

    this.route.params.subscribe(
      params => this.conversationId = params['id']
    );

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

  private clearInboxParameters() {
    if(this.isPhone) {
      this.showThread = false;
      this.openConversation = null;
      this.conversationId = null;
      window.document.getElementsByClassName('page-body')[0].scrollIntoView();
    }
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
      this.loaded = true;
      this.conversations = conversations;

      if(this.conversations.length > 0 && this.isPhone) {
        this.setInboxForPhone();
      }
      else if(this.conversations.length > 0) {
        this.setInbox();
      }
    });
  }

  private setInbox() {
    if(this.conversationId) {
      this.openConversation = this.conversations.filter(conversation => {
        return conversation.id === +this.conversationId;
      })[0];
    }

    if(!this.openConversation) this.openConversation = this.conversations[0];
    this.openConversation.is_read = true;

    if(!this.conversationId) this.location.replaceState('/dashboard/inbox/' + this.openConversation.id);
  }

  private setInboxForPhone() {
    if(this.conversationId) {
      this.openConversation = this.conversations.filter(conversation => {
        return conversation.id === +this.conversationId;
      })[0];

      if(this.openConversation) {
        this.showThread = true;
        this.openConversation.is_read = true;
      }
      else {
        this.location.replaceState('/dashboard/inbox');
      }
    }
  }

  confirmDelete(event: any, conversation: Message) {
    event.stopPropagation();
    let confirmDialog = new ConfirmDialog('Are you sure you want to delete the conversation with ' + conversation.name_to_show +'?', 'deleteConversation', conversation);
    this.modalService.show(CONSTANT.MODAL.CONFIRM, confirmDialog);
  }

  changeConversation(event: any, conversation: Message) {
    if(!this.openConversation || this.openConversation.id !== conversation.id) {
      this.openConversation = conversation;
      this.openConversation.is_read = true;
      if(!this.isPhone) this.location.replaceState('/dashboard/inbox/' + this.openConversation.id);
    }

    if(this.isPhone) {
      if(!this.conversationId) {
        this.location.go('/dashboard/inbox/' + this.openConversation.id);
      }
      else {
        this.location.replaceState('/dashboard/inbox/' + this.openConversation.id);
      }
      window.document.getElementsByClassName('page-body')[0].scrollIntoView();
      this.showThread = true;
    }

  }

}
