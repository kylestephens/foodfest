import { Component, OnInit }       from '@angular/core';
import { ActivatedRoute, Router }  from '@angular/router';
import { Subscription }            from 'rxjs/Subscription'
import { Vendor }                  from '../../shared/model/vendor';
import { VendorService }           from '../../services/vendor.service';
import { CONSTANT }                from '../../core/constant';
/**
 * This class represents the navigation bar component.
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vendorService: VendorService
  )
  {}

  ngOnInit(): void {
    ///params.styles, params.dietreq, params.bustype, params.busset
    this.subscription = this.route.params
      .subscribe(params => {
        if(Object.keys(params).length === 0) this.getVendors();
        else this.searchVendors(params);
      });
  }

  getVendors(): void {
    this.vendorService.getVendors().then(vendors => this.vendors = vendors);
  }

  searchVendors(params: any): void {
    this.vendorService.searchVendors(params).then(vendors => this.vendors = vendors);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
