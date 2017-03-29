import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router }                              from '@angular/router';
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

export class CreateListingComponent {

  public currentStep: number;
  private subscription: Subscription;
  private subMessage: any;

  constructor(
    private createListingService: CreateListingService,
    private router: Router
  ) {
    this.currentStep = 1;

    // subscribe to modal service messages
    this.subscription = this.createListingService.getMessage().subscribe(subMessage => {
      console.debug('CreateListingComponent::subscription');
      this.subMessage = subMessage;
      if(subMessage.event && subMessage.event === CONSTANT.EVENT.CREATE_LISTING.NEXT_STEP) {
        this._nextStep();
      }
      if(subMessage.event && subMessage.event === CONSTANT.EVENT.CREATE_LISTING.PREVIOUS_STEP) {
        this._previousStep();
      }
    });
  };

  public onEvent(message: string): void {
    alert(message);
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

};
