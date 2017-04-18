import { Injectable }        from '@angular/core';
import { Response }          from '@angular/http';
import { Message }           from '../../shared/model/message';
import { RestService }       from '../../services/rest.service';
import { SettingsService }   from '../../services/settings.service';
import { AccountService }    from '../../services/account.service';

@Injectable()
export class InboxService {

  constructor(
    private accountService: AccountService,
    private restService: RestService,
    private settingsService: SettingsService
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

  getConversations(params: any): Promise<Message[]> {
    return this.restService.post(
      this.settingsService.getServerBaseUrl() + '/messages', params, this.accountService.getUser().akAccessToken,
    ).then((response: Response) => {
      return this.convertResponseToMessages(response);
    });
  }

  deleteConversation(messageId: number): Promise<boolean> {
    return this.restService.put(
      this.settingsService.getServerBaseUrl() + '/messages/delete', { messageId: messageId }, this.accountService.getUser().akAccessToken,
    ). then((response:Response) => {});//do nothing, success TODO: handle error
  }

  getMessagesInConversation(messageId: number): Promise<Message[]> {
    return this.restService.get(
        this.settingsService.getServerBaseUrl() + '/messages/' + messageId, null, this.accountService.getUser().akAccessToken,
    ).then((response: Response) => {
      return this.convertResponseToMessages(response);
    });

  }

  createMessage(params: any): Promise<Message> {
    return this.restService.post(
      this.settingsService.getServerBaseUrl() + '/messages/create', params, this.accountService.getUser().akAccessToken,
    ).then((response: Response) => {
      let message = new Message(response.json());
      return message;
    });
    // TODO: handle error
  }

};


