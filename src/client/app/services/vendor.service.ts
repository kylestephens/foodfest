import { Injectable }        from '@angular/core';
import { Vendor }            from '../shared/model/vendor';
import { RestService }       from './rest.service';
import { SettingsService }   from './settings.service';
import { Response }          from '@angular/http';

@Injectable()
export class VendorService {
  vendors: Vendor[];

  constructor(
    private restService: RestService,
    private settingsService: SettingsService
  ) {};

  getVendors(): Promise<Vendor[]> {
    return this.restService.get(
       this.settingsService.getServerBaseUrl() + '/vendors'
    ).then((response: Response) => response.json() as Vendor[]);
  }

};


