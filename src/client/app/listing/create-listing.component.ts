import {
  Component,
  OnDestroy,
  Input,
  ViewEncapsulation
}                                              from '@angular/core';
import {
  LocalStorageService,
  SessionStorageService
}                                    from 'ng2-webstorage';
import { Router, NavigationEnd }               from '@angular/router';
import { Subscription }                        from 'rxjs/Subscription';
import { CreateListingService }                from './create-listing.service';

import { CONSTANT }                            from '../core/constant';

/**
 * This class represents the lazy loaded CreateListingComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-create-listing',
  templateUrl: 'create-listing.component.html',
  styleUrls: ['create-listing.component.css'],
  encapsulation: ViewEncapsulation.None
})


// TODO - Ensure logged in / signed up
export class CreateListingComponent {

  public currentStep: number;
  private routeSubscription: Subscription;
  private navSubscription: Subscription;
  private subMessage: any;

  constructor(
    private createListingService: CreateListingService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.currentStep = 1;

    this.routeSubscription = this.router.events.subscribe((val) => {
      if(parseInt(val.url.slice(-1)) > 1 && !this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.LISTING_STEP_ONE)) {
        console.debug(`
          CreateListingComponent::routeSubscription - Invalid route\n
          Returning to Step 1.
        `);
        this.router.navigate(
          ['list-with-us/create-listing/step-1'],
          {relativeTo: this.route}
        );
      } else {
        this.currentStep = parseInt(val.url.slice(-1));
      }
    });

    // subscribe to modal service messages
    this.navSubscription = this.createListingService.getMessage().subscribe(subMessage => {
      console.debug('CreateListingComponent::subscription');
      this.subMessage = subMessage;
      if(subMessage.event && subMessage.event === CONSTANT.EVENT.CREATE_LISTING.NEXT_STEP) {
        this._nextStep();
      }
      if(subMessage.event && subMessage.event === CONSTANT.EVENT.CREATE_LISTING.PREVIOUS_STEP) {
        this._previousStep();
      }
      if(subMessage.event && subMessage.event === CONSTANT.EVENT.CREATE_LISTING.PREVIEW_LISTING) {
        this._previewListing();
      }
    });
  };

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  };

  private _previousStep = function() {
    this.currentStep--;
    this.router.navigate(['list-with-us/create-listing/step-' + this.currentStep], {relativeTo: this.route});
    window.scrollTo(0, 0);
  };

  private _nextStep = function() {
    this.currentStep++;
    this.router.navigate(['list-with-us/create-listing/step-' + this.currentStep], {relativeTo: this.route});
    window.scrollTo(0, 0);
  };

  private _previewListing = function() {
    // TODO !
  };

};
