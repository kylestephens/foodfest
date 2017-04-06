import { NgModule }                   from '@angular/core';
import { CommonModule }               from '@angular/common';
import { SigninRoutingModule }        from './signin-routing.module';
import { SigninComponent }            from './signin.component';
import { SharedModule }               from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, SigninRoutingModule, SharedModule],
  exports: [SigninComponent],
  declarations: [SigninComponent]
})

export class SigninModule { }
