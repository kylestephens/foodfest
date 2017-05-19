import { NgModule, ModuleWithProviders }  from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';
import { ReactiveFormsModule }            from '@angular/forms';
import { RouterModule }                   from '@angular/router';

import { AccountMetaComponent }           from './account-meta/account-meta.component';
import { CookiesNotificationComponent }   from './cookies-notification/cookies-notification.component';
import { ConfirmDialogComponent }         from './confirm-dialog/confirm-dialog.component';
import { FormMessagesComponent }          from './form-messages/form-messages.component';
import { HeartComponent }                 from './heart/heart.component';
import { ImageScrollerComponent }         from './image-scroller/image-scroller.component';
import { LoaderComponent }                from './loader/loader.component';
import { MessagingComponent }             from './messaging/messaging.component';
import { MobileNavmenuComponent }         from './mobile-navmenu/mobile-navmenu.component';
import { NavbarComponent }                from './navbar/navbar.component';
import { SendMessageComponent }           from './send-message/send-message.component';
import { TwitterFeedComponent }           from './twitter-feed/twitter-feed.component';

import { ModalComponent }                 from './modal/modal.component';
import { SigninComponent }                from './sign/signin/signin.component';
import { SignupComponent }                from './sign/signup/signup.component';
import { ForgotPasswordComponent }        from './forgot-password/forgot-password.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  declarations: [
    HeartComponent,
    NavbarComponent,
    MobileNavmenuComponent,
    AccountMetaComponent,
    CookiesNotificationComponent,
    ConfirmDialogComponent,
    ForgotPasswordComponent,
    FormMessagesComponent,
    ImageScrollerComponent,
    LoaderComponent,
    MessagingComponent,
    ModalComponent,
    TwitterFeedComponent,
    SendMessageComponent,
    SigninComponent,
    SignupComponent
  ],
  exports: [
    HeartComponent,
    NavbarComponent,
    MobileNavmenuComponent,
    AccountMetaComponent,
    CookiesNotificationComponent,
    ConfirmDialogComponent,
    ForgotPasswordComponent,
    FormMessagesComponent,
    ImageScrollerComponent,
    LoaderComponent,
    MessagingComponent,
    ModalComponent,
    TwitterFeedComponent,
    SendMessageComponent,
    SigninComponent,
    SignupComponent,
    CommonModule,
    ReactiveFormsModule,
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
