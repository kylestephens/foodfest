import { Component, Input } 	            from '@angular/core';
import { CONSTANT }                       from '../../../core/constant';
import { Vendor } 			                  from '../../../shared/model/vendor';
import { AccountService }                 from '../../../services/account.service';
import { MessagingService }               from '../../../services/messaging.service';
import { RestService }                    from '../../../services/rest.service';
import { SettingsService }                from '../../../services/settings.service';

@Component({
  moduleId: module.id,
  selector: 'ak-search-results-card',
  templateUrl: 'search-results-card.component.html',
  styleUrls: ['search-results-card.component.css'],
})

export class SearchResultsCardComponent {
	@Input()
	vendor: Vendor;

  @Input()
  favourite: boolean;

  @Input()
  showFavourite: boolean;

  private serverUrl: string = this.settingsService.getServerBaseUrl() + '/';

  constructor(
    private accountService: AccountService,
    private messagingService: MessagingService,
    private restService: RestService,
    private settingsService: SettingsService
  ) {};

  //TODO: needed in case of cross browsing, not needed for now. Maybe will be later when deployed on server.
  // ngOnInit() {
  //   this.vendor.safe_cover_photo_path = this.vendor.cover_photo_path ? this.sanitationService.bypassSecurityTrustStyle(
  //     'url(' + this.vendor.cover_photo_path + ')') : this.vendor.cover_photo_path;
  // }

  onUpdateFavourite(event: any) {
    let params = {
      user_id: this.accountService.getUser().id,
      vendor_id: event.elementId,
      add: event.isLiked
    };
    this.restService.post(
      this.settingsService.getServerBaseUrl() + '/users/favourite',
      params,
      this.accountService.getUser().akAccessToken
    ).then((response: any) => {
      if(event.isLiked) {
        this.accountService.addFavourite(event.elementId);
      } else {
        this.accountService.removeFavourite(event.elementId);
      }
    }).catch((reason: any) => {
      this.messagingService.show(
        'global',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : 'An unexpected error has occurred',
        true
      );
    });
  };

  onHeartClicked(event: any) {
    event.stopPropagation();
    event.preventDefault();
  };
}
