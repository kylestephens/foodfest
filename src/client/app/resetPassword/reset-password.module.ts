import { NgModule }                     from '@angular/core';
import { ResetPasswordRoutingModule }   from './reset-password-routing.module';
import { ResetPasswordComponent }       from './reset-password.component';
import { SharedModule }                 from '../shared/shared.module';

@NgModule({
  imports: [ResetPasswordRoutingModule, SharedModule],
  exports: [ResetPasswordComponent],
  declarations: [ResetPasswordComponent]
})

export class ResetPasswordModule { }
