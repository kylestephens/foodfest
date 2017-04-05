import { Injectable }        from '@angular/core';
import { Response }          from '@angular/http';
import { Vendor }            from '../shared/model/vendor';
import { RestService }       from '../services/rest.service';
import { SettingsService }   from '../services/settings.service';

@Injectable()
export class SearchResultsService {

  constructor(
    private restService: RestService,
    private settingsService: SettingsService
  ) {};

  getVendors(): Promise<Vendor[]> {
      return this.restService.get(
         this.settingsService.getServerBaseUrl() + '/vendors'
      ).then((response: Response) => response.json() as Vendor[]);
  }

  searchVendors(params: any): Promise<Vendor[]> {
     return this.restService.get(
       this.settingsService.getServerBaseUrl() + '/vendors/search', params
    ).then((response: Response) => response.json() as Vendor[]);
  }

};


