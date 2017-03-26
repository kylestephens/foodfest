import { Component, OnInit }   from '@angular/core';
import { Vendor }              from '../shared/model/vendor';
import { VendorService }       from '../services/vendor.service';
import { CONSTANT }            from '../core/constant';
/**
 * This class represents the lazy loaded SearchResults.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-search-results',
  templateUrl: 'search-results.component.html',
  styleUrls: ['search-results.component.css']
})

export class SearchResultsComponent implements OnInit {
	vendors: Vendor[];
  // orderByList = CONSTANT.SEARCH_RESULTS_ORDER_BY;

	constructor(
		private vendorService: VendorService
	)
	{}

	ngOnInit(): void {
		this.getVendors();
  }

	getVendors(): void {
    	this.vendorService.getVendors().then(vendors => this.vendors = vendors);
  }
}
