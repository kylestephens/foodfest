import { Component, OnInit }       from '@angular/core';
import { ActivatedRoute, Router }  from '@angular/router';
import { Subscription }            from 'rxjs/Subscription'
import { Vendor }                  from '../../shared/model/vendor';
import { VendorService }           from '../../services/vendor.service';
import { CONSTANT }                from '../../core/constant';

/**
 * This class represents list of cards on search results page.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-search-results-card-list',
  templateUrl: 'search-results-card-list.component.html',
  styleUrls: ['search-results-card-list.component.css'],
})

export class SearchResultsCardListComponent implements OnInit {
	private vendors: Vendor[];
  private subscription: Subscription;
  private loaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vendorService: VendorService
  )
  {}

  /*
  * Subscribe on route change params - when search params are added/removed, refresh the list of vendors.
  * Param keys are: styles, dietreq, bustype,busset,rating
  */
  ngOnInit(): void {
    this.subscription = this.route.params
      .subscribe(params => {
        this.loaded = false;
        if(Object.keys(params).length === 0) this.getVendors();
        else this.searchVendors(params);
      });
  }

  getVendors(): void {
    this.vendorService.getVendors().then(vendors => {
      this.loaded = true;
      this.vendors = vendors;
    });
  }

  searchVendors(params: any): void {
    this.vendorService.searchVendors(params).then(vendors => {
      this.loaded = true;
      this.vendors = vendors;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
