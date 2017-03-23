import { Component } from '@angular/core';

/**
 * This class represents the lazy loaded CreateListingComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-create-listing',
  templateUrl: 'create-listing.component.html',
  styleUrls: ['create-listing.component.css']
})

export class CreateListingComponent {

  public currentStep: number = 1;

  public previousStep = function() {
    this.currentStep--;
  };

  public nextStep = function() {
    this.currentStep++;
  };

}
