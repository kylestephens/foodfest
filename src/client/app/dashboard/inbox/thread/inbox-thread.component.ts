import { Component, Input, SimpleChanges, ViewEncapsulation }   from '@angular/core';
import { AccountService}                     from '../../../services/account.service';
import { BrowserService }                    from '../../../services/browser.service';
import { InboxService }                      from '../../../services/inbox.service';
import { SettingsService }                   from '../../../services/settings.service';
import { MessagingService }                  from '../../../services/messaging.service';
import { Message }                           from '../../../shared/model/message';
import { LoaderService }                     from '../../../services/loader.service';

/**
 * This class represents the lazy loaded inbox message thread.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-inbox-thread',
  templateUrl: 'inbox-thread.component.html',
  styleUrls: ['inbox-thread.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class InboxThreadComponent {
  @Input()
  conversation: Message;

  messages: Message[];
  userId: number = this.accountService.getUser().id;
  messageText: string;
  serverUrl: string = this.settingsService.getServerBaseUrl() + '/';
  private inboxThread: HTMLElement;
  private inboxOverview: HTMLElement;
  private sideMenu: HTMLElement = <HTMLElement> document.getElementsByClassName('side-menu')[0];
  private browser: any = this.browserService.get();
  private isPhone: boolean = this.browser.deviceType === 'phone';

  constructor(
    private inboxService: InboxService,
    private accountService: AccountService,
    private browserService: BrowserService,
    private settingsService: SettingsService,
    private messagingService: MessagingService,
    private loaderService: LoaderService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.conversation.currentValue && (!changes.conversation.previousValue || changes.conversation.currentValue.id !== changes.conversation.previousValue.id)) {
      window.document.getElementsByClassName('page-body')[0].scrollIntoView();
      this.messagingService.hideAll();
      this.messages = null;
      this.getMessagesInConversation();
    }
  }

  private getMessagesInConversation() {
    this.loaderService.show();
    this.inboxService.getMessagesInConversation(this.conversation.id).then(messages => {
      if(messages) {
        this.messages = messages;
        this.accountService.refreshNotifications();
      }
      this.loaderService.hide();
    });
  }

  sendMessage() {
    if(!this.messageText.trim()) return;

    this.loaderService.show();
    let params = {
        sender_id: this.accountService.getUser().id,
        receiver_id: this.conversation.sender.id === this.accountService.getUser().id ? this.conversation.receiver.id : this.conversation.sender.id,
        content: this.messageText,
        parent_message_id: this.conversation.last_msg_id
      }

    this.inboxService.createMessage(params, 'inbox-thread').then( message => {
      if(message) {
        this.messageText = null;
        message.image_path = this.isUserVendorInConversation() ? this.conversation.vendor.logo_path : null;
        this.messages.unshift(message);
        this.conversation.content = message.content;
        this.conversation.sent_date = message.sent_date;
        this.conversation.last_msg_id = message.id;
      }
      this.loaderService.hide();
    });
  }

  isUserVendorInConversation() {
    return this.conversation ? this.conversation.vendor.user_id === this.userId : null;
  }

}
