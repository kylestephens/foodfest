import { Component, Input } 	            from '@angular/core';
import { Vendor } 			                  from '../../../shared/model/vendor';
import { DomSanitizer, SafeResourceUrl }  from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'ak-search-results-card',
  templateUrl: 'search-results-card.component.html',
  styleUrls: ['search-results-card.component.css'],
})

export class SearchResultsCardComponent {
	@Input()
	vendor: Vendor;

  constructor(private sanitationService: DomSanitizer) {};

  ngOnInit() {
    this.vendor.safe_cover_photo_path = this.vendor.cover_photo_path ? this.sanitationService.bypassSecurityTrustStyle(
      'url(' + this.vendor.cover_photo_path + ')') : this.vendor.cover_photo_path;
  }

  //TODO: a placeholder for handling reacion on liked/unliked event:<EmitEvent>
  vendorLiked(event: any) {
    //event.elementId, event.isLiked
  }
}
