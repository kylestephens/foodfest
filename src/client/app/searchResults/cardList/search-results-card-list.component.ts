import { Component, Input } from '@angular/core';
import { Vendor }           from '../../shared/model/vendor';
/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-search-results-card-list',
  templateUrl: 'search-results-card-list.component.html',
  styleUrls: ['search-results-card-list.component.css'],
})

export class SearchResultsCardListComponent {
	@Input()
	vendors: Vendor[];
}
