import { NgModule, ModuleWithProviders }  from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';
import { RouterModule }                   from '@angular/router';

import { AccountMetaComponent }           from './account-meta/account-meta.component';
import { FormMessagesComponent }          from './form-messages/form-messages.component';
import { HeartComponent }                 from './heart/heart.component';
import { ImageScrollerComponent }         from './image-scroller/image-scroller.component';
import { MessagingComponent }             from './messaging/messaging.component';
import { MobileNavmenuComponent }         from './mobile-navmenu/mobile-navmenu.component';
import { NavbarComponent }                from './navbar/navbar.component';

// TODO : tidy these 3 into a single module
import { ModalComponent }                 from './modal/modal.component';
import { SigninComponent }                from './modal/signin/signin.component';
import { SignupComponent }                from './modal/signup/signup.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule],
  declarations: [
    HeartComponent,
    NavbarComponent,
    MobileNavmenuComponent,
    AccountMetaComponent,
    FormMessagesComponent,
    ImageScrollerComponent,
    MessagingComponent,
    ModalComponent,
    SigninComponent,
    SignupComponent
  ],
  exports: [
    HeartComponent,
    NavbarComponent,
    MobileNavmenuComponent,
    AccountMetaComponent,
    FormMessagesComponent,
    ImageScrollerComponent,
    MessagingComponent,
    ModalComponent,
    SigninComponent,
    SignupComponent,
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
