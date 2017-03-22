import { NgModule }                 from '@angular/core';
import { CommonModule }             from '@angular/common';
import { CommercialComponent }      from './commercial.component';
import { CommercialRoutingModule }  from './commercial-routing.module';

@NgModule({
  imports: [CommonModule, CommercialRoutingModule],
  declarations: [CommercialComponent],
  exports: [CommercialComponent]
})

export class CommercialModule { }
