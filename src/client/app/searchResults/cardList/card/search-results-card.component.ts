import { Component, Input } 	from '@angular/core';
import { Vendor } 			      from '../../../shared/model/vendor';

@Component({
  moduleId: module.id,
  selector: 'ak-search-results-card',
  templateUrl: 'search-results-card.component.html',
  styleUrls: ['search-results-card.component.css'],
})

export class SearchResultsCardComponent {
	@Input()
	vendor: Vendor;

  //TODO: a placeholder for handling reacion on liked/unliked event:<EmitEvent>
  vendorLiked(event) {
    //event.elementId, event.isLiked
  }
}
