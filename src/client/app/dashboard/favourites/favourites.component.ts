import { Component }           from '@angular/core';
import { Response }            from '@angular/http';
import { Vendor }              from '../../shared/model/vendor';
import { AccountService }      from '../../services/account.service';
import { RestService }         from '../../services/rest.service';
import { SettingsService }     from '../../services/settings.service';

/**
 * This class represents the lazy loaded Favourites Dashboard.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-favourites',
  templateUrl: 'favourites.component.html',
  styleUrls: ['favourites.component.css']
})

export class FavouritesComponent {

  public favourites: Array<any> = [];

  private loaded: boolean = false;
  private vendors: Vendor[];

  constructor(
    private accountService: AccountService,
    private restService: RestService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    if(this.accountService.isLoggedIn()) {
      this.setup();
    }
  }

  setup(): void {
    this.accountService.getFavourites().then((favourites: Array<number>) => {
      this.favourites = favourites;
      this.loaded = true;
      let filter = '';
      if(this.favourites && this.favourites.length > 0) {
        filter = this.favourites.join(',');
        this.restService.get(
          this.settingsService.getServerBaseUrl() + '/vendors?id=' + filter
        ).then((response: Response) => {
          this.vendors = response.json() as Vendor[]
        });
      }
    });
  }

  pageChanged() {
    window.document.getElementsByClassName('page-body')[0].scrollIntoView();
  }

}
