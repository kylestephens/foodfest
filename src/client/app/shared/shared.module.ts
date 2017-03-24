import { NgModule, ModuleWithProviders }  from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';
import { RouterModule }                   from '@angular/router';

import { AccountMetaComponent }           from './account-meta/account-meta.component';
import { MessagingComponent }             from './messaging/messaging.component';
import { MobileNavmenuComponent }         from './mobile-navmenu/mobile-navmenu.component';
import { NavbarComponent }                from './navbar/navbar.component';
import { HeartComponent }                 from './heart/heart.componet';

// TODO : tidy these 3 into a single module
import { ModalComponent }                 from './modal/modal.component';
import { SigninComponent }                from './modal/signin/signin.component';
import { SignupComponent }                from './modal/signup/signup.component';

import { NameListService }                from './name-list/name-list.service';

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
      providers: [ NameListService ]
    };
  }
}
