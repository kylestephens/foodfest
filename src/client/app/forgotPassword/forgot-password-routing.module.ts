import { NgModule }                 from '@angular/core';
import { RouterModule }             from '@angular/router';
import { ForgotPasswordComponent }  from   './forgot-password.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: ForgotPasswordComponent }
    ])
  ],
  exports: [RouterModule]
})

export class ForgotPasswordRoutingModule { }
