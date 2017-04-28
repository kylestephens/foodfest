import { Injectable }        from '@angular/core';
import { Response }          from '@angular/http';
import { Market }            from '../shared/model/market';
import { RestService }       from '../services/rest.service';
import { SettingsService }   from '../services/settings.service';

@Injectable()
export class MarketService {

  constructor(
    private restService: RestService,
    private settingsService: SettingsService
  ) {};


  getMarkets(): Promise<Market[]> {
    return this.restService.get(
      this.settingsService.getServerBaseUrl() + '/markets'
    ).then((response: Response) => response.json() as Market[] );
  }

};


