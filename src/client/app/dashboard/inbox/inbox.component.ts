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
  private serverUrl: string = this.settingsService.getServerBaseUrl() + '/';
  private DELETE_CONVERSATION_ACTION = 'deleteConversation';

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
      this.clearInboxParameters();
    });
  }

  ngOnInit() {
    this.getConversations();

    this.route.params.subscribe(
      params => this.conversationId = +params['id']
    );

    this.subscription = this.confirmDialogService.dialogConfirmed.subscribe(
    confirmDialog => {
      if(confirmDialog.action && confirmDialog.action === this.DELETE_CONVERSATION_ACTION) {
        this.inboxService.deleteConversation(confirmDialog.record.id).then((success) => {
          this.modalService.hide();
          if(success) {
            this.removeConversation(confirmDialog.record.id);
          }
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

  private removeConversation(conversationId: number) {
    let currentIndex: number;
    if(conversationId === this.openConversation.id) {
      currentIndex = this.conversations.map(function(record) { return record.id; }).indexOf(this.openConversation.id);
      if(currentIndex === this.conversations.length -1) {
        currentIndex -=1;
      }
    }

    let conversationDeletedIndex = this.conversations.map(function(record) { return record.id; }).indexOf(conversationId);
    if (conversationDeletedIndex > -1) {
      this.conversations.splice(conversationDeletedIndex, 1);
    }

    if(currentIndex) {
      this.openConversation = this.conversations.length > 0 ? this.conversations[currentIndex] : null;
      if(this.openConversation) this.openConversation.is_read = true;
    }
    else {
      this.openConversation = this.conversations.length > 0 ? this.conversations[0] : null;
      if(this.openConversation) this.openConversation.is_read = true;
    }

  }

  getConversations() {
    this.inboxService.getConversations().then(conversations => {
      if(conversations) {
        this.loaded = true;
        this.conversations = conversations;

        if(this.conversations.length > 0 && this.isPhone) {
          this.setInboxForPhone();
        }
        else if(this.conversations.length > 0) {
          this.setInbox();
        }
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
    let confirmDialog = new ConfirmDialog('Are you sure you want to delete the conversation with ' + conversation.message_title +'?', this.DELETE_CONVERSATION_ACTION, conversation);
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
