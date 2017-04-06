import { NgModule }                   from '@angular/core';
import { CommonModule }               from '@angular/common';
import { FormsModule }                from '@angular/forms';
import { SignupRoutingModule }        from './signup-routing.module';
import { SignupComponent }            from './signup.component';

@NgModule({
  imports: [CommonModule, FormsModule, SignupRoutingModule],
  exports: [SignupComponent],
  declarations: [SignupComponent]
})

export class SignupModule { }
