import { Injectable }        from '@angular/core';
import { Response }          from '@angular/http';
import { Market }            from '../shared/model/market';
import { RestService }       from '../services/rest.service';
import { SettingsService }   from '../services/settings.service';
import { AccountService }    from '../services/account.service';
import { MessagingService }  from '../services/messaging.service';
import { CONSTANT }          from '../core/constant';

@Injectable()
export class LeaveReviewService {

  constructor(
    private restService: RestService,
    private settingsService: SettingsService,
    private messagingService: MessagingService,
    private accountService: AccountService,
  ) {};


  getDetailsFromEmailToken(params: any): Promise<any> {
    return this.restService.get(
      this.settingsService.getServerBaseUrl() + '/review/email', params, this.accountService.getUser().akAccessToken
    ).then((response: Response) => {
      return response.json();
    }).catch(
    (reason:any) => {
      return Promise.reject(reason);
    });
  }

  addReview(params: any): Promise<boolean> {
    return this.restService.post(
      this.settingsService.getServerBaseUrl() + '/review/add', params, this.accountService.getUser().akAccessToken
    ).then((response: Response) => {
      return response.json();
    }).catch(
    (reason:any) => {
      return Promise.reject(reason);
    });
  }

  addReviewReminder(params: any): Promise<boolean> {
    return this.restService.post(
      this.settingsService.getServerBaseUrl() + '/review/reminder', params, this.accountService.getUser().akAccessToken
    ).then((response: Response) => {
      return response.json();
    }).catch(
    (reason:any) => {
      return Promise.reject(reason);
    });
  }

  deleteReviewEmail(params: any): Promise<boolean> {
    return this.restService.post(
      this.settingsService.getServerBaseUrl() + '/review/delete', params, this.accountService.getUser().akAccessToken
    ).then((response: Response) => {
      return response.json();
    }).catch(
    (reason:any) => {
      return Promise.reject(reason);
    });
  }

};


