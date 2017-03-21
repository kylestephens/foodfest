import { Component, OnInit }       from '@angular/core';
import { Router, NavigationEnd }   from '@angular/router'
import { Config }                  from './shared/config/env.config';
import './operators';

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {

  constructor(private router: Router) {
    console.log('Environment config', Config);
  };

  ngOnInit() {
    // angular route changes don't return you to the top
    // of the page for the new page - force this to occur
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  };

}
