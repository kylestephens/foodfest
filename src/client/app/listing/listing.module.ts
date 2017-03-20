import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingComponent } from './listing.component';
import { ListingRoutingModule } from './listing-routing.module';

@NgModule({
  imports: [CommonModule, ListingRoutingModule],
  declarations: [ListingComponent],
  exports: [ListingComponent]
})
export class ListingModule { }
