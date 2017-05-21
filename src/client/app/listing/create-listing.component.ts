import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewEncapsulation
}                                           from '@angular/core';
import {
  LocalStorageService
}                                           from 'ng2-webstorage';
import { Router }                           from '@angular/router';
import { Subscription }                     from 'rxjs/Subscription';
import { CreateListingService }             from './create-listing.service';

import { CONSTANT }                         from '../core/constant';

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
export class CreateListingComponent implements OnInit {

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

    this.routeSubscription = this.router.events.subscribe((val: any) => {
      if(val.url && val.url.split('/')[1] === 'list-with-us') {
        if(parseInt(val.url.slice(-1)) > 1 && !this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.LISTING_STEP_ONE)) {
          console.debug(`
            CreateListingComponent::routeSubscription - Invalid route\n
            Returning to Step 1.
          `);
          this.router.navigate(
            ['list-with-us/create-listing/step-1']
          );
        } else {
          this.currentStep = parseInt(val.url.slice(-1));
        }
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
        this._previewListing(subMessage.vendorId);
      }
    });
  };

  ngOnInit() {
    this.currentStep = 1;
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.navSubscription.unsubscribe();
  };

  private _previousStep = function() {
    this.currentStep--;
    this.router.navigate(['list-with-us/create-listing/step-' + this.currentStep]);
    window.document.getElementsByClassName('page-body')[0].scrollIntoView();
  };

  private _nextStep = function() {
    this.currentStep++;
    this.router.navigate(['list-with-us/create-listing/step-' + this.currentStep]);
    window.document.getElementsByClassName('page-body')[0].scrollIntoView();
  };

  private _previewListing = function(vendorId: number) {
    this.router.navigate(['vendor/' + vendorId]);
    window.document.getElementsByClassName('page-body')[0].scrollIntoView();
  };

};
