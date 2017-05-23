import { Component }           from '@angular/core';
import { Response }            from '@angular/http';
import { Vendor }              from '../../shared/model/vendor';
import { AccountService }      from '../../services/account.service';
import { RestService }         from '../../services/rest.service';
import { SettingsService }     from '../../services/settings.service';
import { MessagingService }    from '../../services/messaging.service';
import { CONSTANT }            from '../../core/constant';
import { LoaderService }       from '../../services/loader.service';

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
    private settingsService: SettingsService,
    private messagingService: MessagingService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    if(this.accountService.isLoggedIn()) {
      this.setup();
    }
  }

  setup(): void {
    this.loaderService.show();
    this.accountService.getFavourites()
    .then((favourites: Array<number>) => {
      this.favourites = favourites;
      let filter = '';
      if(this.favourites && this.favourites.length > 0) {
        filter = this.favourites.join(',');
        this.restService.get(
          this.settingsService.getServerBaseUrl() + '/vendors?id=' + filter
        ).then((response: Response) => {
          this.loaded = true;
          this.vendors = response.json() as Vendor[];
          this.loaderService.hide();
        }).
        catch((response: any) => {
          this.messagingService.show(
            'favourites',
            CONSTANT.MESSAGING.ERROR,
            response.statusText ? response.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR
          );
          this.loaderService.hide();
        });
      }
      else {
        this.loaded = true;
        this.loaderService.hide();
      }
    })
    .catch((reason: any) => {
      this.messagingService.show(
        'favourites',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR
      );
      this.loaderService.hide();
    })
  }

  pageChanged() {
    window.document.getElementsByClassName('page-body')[0].scrollIntoView();
  }

}
