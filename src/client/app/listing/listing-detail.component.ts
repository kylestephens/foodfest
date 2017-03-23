import { Component }                from '@angular/core';
import { Router, ActivatedRoute }   from '@angular/router';

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
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  public choosePlan = function(planNumber: number) {
    this.planType = planNumber;
    this.router.navigate(['../create-listing'], {relativeTo: this.route});
  }

}
