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

  //TODO: a placeholder for handling reacion on liked/unliked event:<EmitEvent>
  updateFavourites(event: any) {
    let params = {
      user_id: this.accountService.getUser().id,
      vendor_id: event.elementId,
      add: event.isLiked
    };
    this.restService.post(
      this.settingsService.getServerBaseUrl() + '/users/favourite',
      params,
      this.accountService.getUser().akAccessToken
    ).then(function(response: any) {
      // do nothing
      // be happy :)
    }, (reason: any) => {
      this.messagingService.show(
        'global',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : 'An unexpected error has occurred',
        true
      );
    });
  }

  heartClicked(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }
}
