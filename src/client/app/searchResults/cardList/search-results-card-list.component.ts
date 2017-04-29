import {
  Component,
  OnInit,
  OnDestroy
}                                  from '@angular/core';
import { ActivatedRoute, Router }  from '@angular/router';
import { Subscription }            from 'rxjs/Subscription';
import { Vendor }                  from '../../shared/model/vendor';
import { SearchResultsService }    from '../search-results.service';
import { CONSTANT }                from '../../core/constant';
import { AccountService }          from '../../services/account.service';

/**
 * This class represents list of cards on search results page.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-search-results-card-list',
  templateUrl: 'search-results-card-list.component.html',
  styleUrls: ['search-results-card-list.component.css'],
})

export class SearchResultsCardListComponent implements OnInit, OnDestroy {

  public favourites: Array<any> = [];

  private vendors: Vendor[];
  private subscription: Subscription;
  private loaded: boolean = false;

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private searchResultsService: SearchResultsService
  )
  {}

  /**
   * Subscribe on route change params - when search params are added/removed, refresh the list of vendors.
   * Param keys are: styles, dietreq, bustype, busset, rating
   */
  ngOnInit(): void {
    this.subscription = this.route.params
      .subscribe(params => {
        this.loaded = false;
        if(Object.keys(params).length === 0) this.getVendors();
        else this.searchVendors(params);
      });
    if(this.accountService.isLoggedIn()) {
      this.accountService.getFavourites().then((favourites: Array<number>) => {
        this.favourites = favourites;
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getVendors(): void {
    this.searchResultsService.getVendors().then(vendors => {
      this.loaded = true;
      this.vendors = vendors;
    });
  }

  searchVendors(params: any): void {
    this.searchResultsService.searchVendors(params).then(vendors => {
      this.loaded = true;
      this.vendors = vendors;
    });
  }

  isFavourite(vendor: any): boolean {
    if(this.favourites && this.favourites.indexOf(vendor.id) > -1) return true;
    return false;
  }
}
