import { Component, OnInit }       from '@angular/core';
import { Router, NavigationEnd }   from '@angular/router';
import { Config }                  from './shared/config/env.config';
import { AccountService }          from './services/account.service';
import { SettingsService }         from './services/settings.service';
import { CONSTANT }                from './core/constant';
import {
  LocalStorageService,
  SessionStorageService
} from 'ng2-webstorage';
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
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private accountService: AccountService,
    private localStorageService: LocalStorageService,
    private settingsService: SettingsService
  ) {
    console.log('Environment config', Config);

    // Check local storage for login details - keep signed in
    if(this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.SESSION)) {
      this.accountService.reloadSession(
        this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.SESSION),
        this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.TOKEN)
      );
    }
  };

  ngOnInit() {
    // angular route changes don't return you to the top
    // of the page for the new page - force this to occur
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    // Check for site settings
    this.settingsService.syncSiteSettings();
  };

}
