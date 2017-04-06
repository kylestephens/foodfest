import { NgModule }                   from '@angular/core';
import { CommonModule }               from '@angular/common';
import { FormsModule }                from '@angular/forms';
import { SigninRoutingModule }        from './signin-routing.module';
import { SigninComponent }            from './signin.component';

@NgModule({
  imports: [CommonModule, FormsModule, SigninRoutingModule],
  exports: [SigninComponent],
  declarations: [SigninComponent]
})

export class SigninModule { }
