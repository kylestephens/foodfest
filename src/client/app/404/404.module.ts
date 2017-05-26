import { NgModule }                 from '@angular/core';
import { CommonModule }             from '@angular/common';
import { FourOhFourComponent }      from './404.component';
import { FourOhFourRoutingModule }  from './404-routing.module';

@NgModule({
  imports: [CommonModule, FourOhFourRoutingModule],
  declarations: [FourOhFourComponent],
  exports: [FourOhFourComponent]
})
export class FourOhFourModule { }
