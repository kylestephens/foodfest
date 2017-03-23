import { NgModule }               from '@angular/core';
import { CommonModule }           from '@angular/common';
import { CreateListingComponent } from './create-listing.component';
import { ListingDetailComponent } from './listing-detail.component';
import { ListingMasterComponent } from './listing-master.component';
import { ListingRoutingModule }   from './listing-routing.module';

@NgModule({
  imports: [CommonModule, ListingRoutingModule],
  declarations: [
    CreateListingComponent,
    ListingDetailComponent,
    ListingMasterComponent
  ],
  exports: [
    CreateListingComponent,
    ListingDetailComponent,
    ListingMasterComponent
  ]
})

export class ListingModule { }
