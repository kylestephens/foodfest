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

  constructor(
    private router: Router
  ) {}

}
