import { Component }      from '@angular/core';
import { Router }         from '@angular/router';

/**
 * This class represents the lazy loaded ListingComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-listing-detail',
  templateUrl: 'listing-detail.component.html',
  styleUrls: ['listing-detail.component.css']
})
export class ListingDetailComponent {

  private planType: number;

  constructor(
    private router: Router
  ) {}

  public choosePlan = function(planNumber: number) {
    this.planType = planNumber;
    this.router.navigate(['/list-with-us/create-listing/step-1'], {relativeTo: this.route});
  }

}
