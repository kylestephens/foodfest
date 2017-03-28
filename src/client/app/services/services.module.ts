import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpModule }        from '@angular/http';

import { AccountService }    from './account.service';
import { BrowserService }    from './browser.service';
import { FacebookService }   from './facebook.service';
import { GoogleService }     from './google.service';
import { MessagingService }  from './messaging.service';
import { ModalService }      from './modal.service';
import { RestService }       from './rest.service';
import { SettingsService }   from './settings.service';
import { ValidationService } from './validation.service';
import { VendorService }     from './vendor.service';
import { WindowRefService }  from './window-ref.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  providers: [
    AccountService,
    BrowserService,
    GoogleService,
    FacebookService,
    MessagingService,
    ModalService,
    RestService,
    SettingsService,
    ValidationService,
    VendorService,
    WindowRefService
  ]
})
export class ServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [
        AccountService,
        BrowserService,
        GoogleService,
        FacebookService,
        MessagingService,
        ModalService,
        RestService,
        SettingsService,
        ValidationService,
        VendorService,
        WindowRefService
      ]
    };
  }
}
