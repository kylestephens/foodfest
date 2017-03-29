import { Injectable }        from '@angular/core';
import { Response }          from '@angular/http';
import { Style }             from '../shared/model/style';
import { RestService }       from './rest.service';
import { SettingsService }   from './settings.service';

@Injectable()
export class StylesService {
  categories: Style[];

  constructor(
    private restService: RestService,
    private settingsService: SettingsService
  ) {};

  getStyles(): Promise<Style[]> {
    return this.restService.get(
       this.settingsService.getServerBaseUrl() + '/styles'
    ).then((response: Response) => response.json() as Style[]);
  }

}





