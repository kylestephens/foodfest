import { Component, Input, SimpleChanges }   from '@angular/core';
import { AccountService}                     from '../../../services/account.service';
import { BrowserService }                    from '../../../services/browser.service';
import { InboxService }                      from '../../../services/inbox.service';
import { Message }                           from '../../../shared/model/message';

/**
 * This class represents the lazy loaded inbox message thread.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-inbox-thread',
  templateUrl: 'inbox-thread.component.html',
  styleUrls: ['inbox-thread.component.css']
})

export class InboxThreadComponent {
  @Input()
  conversation: Message;

  messages: Message[];
  userId: number = this.accountService.getUser().id;
  messageText: string;
  private inboxThread: HTMLElement;
  private inboxOverview: HTMLElement;
  private sideMenu: HTMLElement = <HTMLElement> document.getElementsByClassName('side-menu')[0];
  private browser: any = this.browserService.get();
  private isPhone: boolean = this.browser.deviceType === 'phone';

  constructor(
    private inboxService: InboxService,
    private accountService: AccountService,
    private browserService: BrowserService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.conversation.currentValue && (!changes.conversation.previousValue || changes.conversation.currentValue.id !== changes.conversation.previousValue.id)) {
      this.getMessagesInConversation();
    }
  }

  ngAfterViewChecked() {
    if(!this.isPhone) {
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
  }

  private getMessagesInConversation() {
    this.inboxService.getMessagesInConversation(this.conversation.id).then(messages => {
      this.messages = messages;
    });//TODO: if uncesessfull, change to previously selected conversation
  }

  sendMessage() {
    let params = {
        sender_id: this.accountService.getUser().id,
        receiver_id: this.conversation.sender.id === this.accountService.getUser().id ? this.conversation.receiver.id : this.conversation.sender.id,
        vendor_id: this.conversation.vendor.id,
        content: this.messageText,
        parent_message_id: this.conversation.last_msg_id
      }

    this.inboxService.createMessage(params).then( message => {
      this.messageText = null;
      this.messages.unshift(message);
      this.conversation.content = message.content;
      this.conversation.sent_date = message.sent_date;
      this.conversation.last_msg_id = message.id;
    });
  }

}
