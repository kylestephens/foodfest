import { Component }     from '@angular/core';
import { Router }        from '@angular/router';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent {

  constructor(
    private router: Router
  ) {};

  public onClickHeading() {
    this.router.navigate(
      ['search-results']
    );
  }

}
