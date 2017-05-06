import { Injectable }        from '@angular/core';
import { Response }          from '@angular/http';
import { Message }           from '../shared/model/message';
import { RestService }       from '../services/rest.service';
import { SettingsService }   from '../services/settings.service';
import { AccountService }    from '../services/account.service';
import { MessagingService }  from '../services/messaging.service';
import { CONSTANT }          from '../core/constant';

@Injectable()
export class InboxService {

  constructor(
    private accountService: AccountService,
    private restService: RestService,
    private settingsService: SettingsService,
    private messagingService: MessagingService
  ) {};

  private convertResponseToMessages(response: Response) {
    let jsonResponse = response.json(),
        messages: Message[] = [],
        message: Message;

    for(let data of jsonResponse) {
      message = new Message(data);
      messages.push(message);
    }
    return messages;
  }

  getConversations(): Promise<Message[]> {
    return this.restService.get(
      this.settingsService.getServerBaseUrl() + '/messages', null, this.accountService.getUser().akAccessToken,
    ).then((response: Response) => {
      return this.convertResponseToMessages(response);
    }).catch(
    (reason:any) => {
      this.messagingService.show(
        'inbox',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : 'An unexpected error has occurred, try again later'
      );
    });
  }

  deleteConversation(conversationId: number): Promise<boolean> {
    return this.restService.put(
      this.settingsService.getServerBaseUrl() + '/messages/delete', { conversationId: conversationId }, this.accountService.getUser().akAccessToken,
    ). then((response:Response) => {
       this.messagingService.show(
        'inbox-thread',
        CONSTANT.MESSAGING.SUCCESS,
        'Conversation successfully deleted',
        true
      );
      return true;
    }).catch(
    (reason: any) => {
      this.messagingService.show(
        'inbox-thread',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : 'An unexpected error has occurred, try again later',
        true
      );
      return false;
    });
  }

  getMessagesInConversation(conversationId: number): Promise<Message[]> {
    return this.restService.get(
        this.settingsService.getServerBaseUrl() + '/messages/' + conversationId, null, this.accountService.getUser().akAccessToken,
    ).then((response: Response) => {
      return this.convertResponseToMessages(response);
    }).catch(
    (reason: any) => {
       this.messagingService.show(
        'inbox-thread',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : 'An unexpected error has occurred, try again later'
      );
    });

  }

  createMessage(params: any, calledFrom: string): Promise<Message> {
    return this.restService.post(
      this.settingsService.getServerBaseUrl() + '/messages/create', params, this.accountService.getUser().akAccessToken,
    ).then(
    (response: Response) => {
      let message = new Message(response.json());
       this.messagingService.show(
        calledFrom,
        CONSTANT.MESSAGING.SUCCESS,
        'Message sent successfully',
        true
      );
      return message;
    }).catch(
    (reason: any) => {
      this.messagingService.show(
        calledFrom,
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : 'An unexpected error has occurred, try again later',
        true
      );
    });
  }

};


