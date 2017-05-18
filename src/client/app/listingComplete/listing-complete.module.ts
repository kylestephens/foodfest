import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { ListingCompleteRoutingModule }   from './listing-complete-routing.module';
import { ListingCompleteComponent }       from './listing-complete.component';
@NgModule({
  imports: [
    CommonModule,
    ListingCompleteRoutingModule
  ],
  declarations: [
    ListingCompleteComponent
  ]
})

export class ListingCompleteModule { }
