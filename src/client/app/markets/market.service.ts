import { Injectable }        from '@angular/core';
import { Response }          from '@angular/http';
import { Market }            from '../shared/model/market';
import { RestService }       from '../services/rest.service';
import { SettingsService }   from '../services/settings.service';
import { MessagingService }  from '../services/messaging.service';
import { CONSTANT }          from '../core/constant';

@Injectable()
export class MarketService {

  constructor(
    private restService: RestService,
    private settingsService: SettingsService,
    private messagingService: MessagingService
  ) {};


  getMarkets(): Promise<Market[]> {
    return this.restService.get(
      this.settingsService.getServerBaseUrl() + '/markets'
    ).then((response: Response) => response.json() as Market[] ).catch(
    (reason:any) => {
      this.messagingService.show(
        'global',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : 'An unexpected error has occurred, try again later'
      );
    });;
  }

};


