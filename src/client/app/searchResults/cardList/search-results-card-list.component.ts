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
import { LoaderService }           from '../../services/loader.service';
import { MessagingService }        from '../../services/messaging.service';

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
  private routeSub: Subscription;
  private loginSub: Subscription;
  private loaded: boolean = false;

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private searchResultsService: SearchResultsService,
    private loaderService: LoaderService,
    private messagingService: MessagingService
  ) {
    this.loginSub = this.accountService.getMessage().subscribe(subMessage => {
      if(subMessage.event === CONSTANT.EVENT.SESSION.LOGGED_IN || subMessage.event === CONSTANT.EVENT.SESSION.USER_TYPE) {
        if(this.accountService.isLoggedIn()) {
          this.setFavourites();
        }
      }
    });
  }

  /**
   * Subscribe on route change params - when search params are added/removed, refresh the list of vendors.
   * Param keys are: styles, dietreq, bustype, busset, rating
   */
  ngOnInit(): void {
    this.routeSub = this.route.params
      .subscribe(params => {
        this.loaderService.show();
        this.loaded = false;
        if(Object.keys(params).length === 0) this.getVendors();
        else this.searchVendors(params);
      });
    if(this.accountService.isLoggedIn()) {
      this.setFavourites();
    }
  }

  ngOnDestroy(): void {
    this.loginSub.unsubscribe();
    this.routeSub.unsubscribe();
  }

  getVendors(): void {
    this.searchResultsService.getVendors()
    .then(vendors => {
      this.loaded = true;
      this.vendors = vendors;
      this.loaderService.hide();
    })
    .catch((reason: any) => {
      this.messagingService.show(
        'global',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR
      );
      this.loaderService.hide();
    });
  }

  searchVendors(params: any): void {
    this.searchResultsService.searchVendors(params)
    .then(vendors => {
      this.loaded = true;
      this.vendors = vendors;
      this.loaderService.hide();
    })
    .catch((reason: any) => {
      this.messagingService.show(
        'global',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR
      );
      this.loaderService.hide();
    });
  }

  setFavourites(): void {
    this.accountService.getFavourites().then((favourites: Array<number>) => {
      this.favourites = favourites;
    });
  }

  isLoggedIn(): boolean {
    return this.accountService.isLoggedIn();
  }

  isFavourite(vendor: any): boolean {
    if(this.favourites && this.favourites.indexOf(vendor.id) > -1) return true;
    return false;
  }

  pageChanged() {
    window.document.getElementsByClassName('page-body')[0].scrollIntoView();
  }
}
