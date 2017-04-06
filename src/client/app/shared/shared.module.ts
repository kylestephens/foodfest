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

import { ModalComponent }                 from './modal/modal.component';
import { SigninModule }                   from '../sign/signin/signin.module';
import { SignupModule }                   from '../sign/signup/signup.module';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule, SignupModule, SigninModule],
  declarations: [
    HeartComponent,
    NavbarComponent,
    MobileNavmenuComponent,
    AccountMetaComponent,
    FormMessagesComponent,
    ImageScrollerComponent,
    MessagingComponent,
    ModalComponent
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
