import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpModule }            from '@angular/http';

import { AccountService }        from './account.service';
import { BrowserService }        from './browser.service';
import { ConfirmDialogService }  from './confirm-dialog.service';
import { FacebookService }       from './facebook.service';
import { GoogleService }         from './google.service';
import { InboxService }          from './inbox.service';
import { MessagingService }      from './messaging.service';
import { ModalService }          from './modal.service';
import { RestService }           from './rest.service';
import { SettingsService }       from './settings.service';
import { ValidationService }     from './validation.service';
import { WindowRefService }      from './window-ref.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  providers: [
    AccountService,
    BrowserService,
    ConfirmDialogService,
    GoogleService,
    InboxService,
    FacebookService,
    MessagingService,
    ModalService,
    RestService,
    SettingsService,
    ValidationService,
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
        ConfirmDialogService,
        GoogleService,
        InboxService,
        FacebookService,
        MessagingService,
        ModalService,
        RestService,
        SettingsService,
        ValidationService,
        WindowRefService
      ]
    };
  }
}
