import { NgModule }                   from '@angular/core';
import { SignupRoutingModule }        from './signup-routing.module';
import { SignupComponent }            from './signup.component';
import { SharedModule }               from '../shared/shared.module';

@NgModule({
  imports: [SignupRoutingModule, SharedModule],
  exports: [SignupComponent],
  declarations: [SignupComponent]
})

export class SignupModule { }
