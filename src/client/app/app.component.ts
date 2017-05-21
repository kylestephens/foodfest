import {
  Component,
  OnInit,
  AfterViewInit
}                                  from '@angular/core';
import { Router, NavigationEnd }   from '@angular/router';
import { Subscription }            from 'rxjs/Subscription';
import { Config }                  from './shared/config/env.config';
import { AccountService }          from './services/account.service';
import { MessagingService }        from './services/messaging.service';
import { SettingsService }         from './services/settings.service';
import { CONSTANT }                from './core/constant';
import {
  LocalStorageService
}                                  from 'ng2-webstorage';
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
export class AppComponent implements OnInit, AfterViewInit {

  public displayCookies: boolean = true;
  private subscription: Subscription;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private localStorageService: LocalStorageService,
    private messagingService: MessagingService,
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

    this.subscription = this.accountService.getMessage().subscribe(subMessage => {
      if(subMessage.event === CONSTANT.EVENT.SESSION.LOGGED_IN || subMessage.event === CONSTANT.EVENT.SESSION.USER_TYPE ) {
        if(this.accountService.isLoggedIn()) {
          this.getVendors();
        }
      }
    });
  };

  ngOnInit() {
    // angular route changes don't return you to the top
    // of the page for the new page - force this to occur
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.document.getElementsByClassName('page-body')[0].scrollIntoView();
      this.messagingService.hideAll();  // clear any messages that were left behind from previous page
    });

    // Check for site settings
    this.settingsService.syncSiteSettings();

    if(this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.COOKIES)) {
      this.displayCookies = false;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    if(this.accountService.isLoggedIn() && this.accountService.getUser().user_type === CONSTANT.user.types.VENDOR.code) {
      this.getVendors();
    }
  }

  getVendors() {
    if(this.accountService.isLoggedIn()) {
      this.accountService.getVendors();
    }
  }

}
