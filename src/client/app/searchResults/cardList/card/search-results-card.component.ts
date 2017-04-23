import { Component, Input } 	            from '@angular/core';
import { Vendor } 			                  from '../../../shared/model/vendor';
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

  constructor(private settingsService: SettingsService) {};

  //TODO: needed in case of cross browsing, not needed for now. Maybe will be later when deployed on server.
  // ngOnInit() {
  //   this.vendor.safe_cover_photo_path = this.vendor.cover_photo_path ? this.sanitationService.bypassSecurityTrustStyle(
  //     'url(' + this.vendor.cover_photo_path + ')') : this.vendor.cover_photo_path;
  // }

  //TODO: a placeholder for handling reacion on liked/unliked event:<EmitEvent>
  updateFavourites(event: any) {
    //event.elementId, event.isLiked
  }

  heartClicked(event: any) {
    event.preventDefault();
  }
}
