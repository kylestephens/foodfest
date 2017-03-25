import { NgModule }               from '@angular/core';
import { CommonModule }           from '@angular/common';
import { ReactiveFormsModule }    from '@angular/forms';
import { CreateListingComponent } from './create-listing.component';
import { ListingDetailComponent } from './listing-detail.component';
import { ListingMasterComponent } from './listing-master.component';
import { ListingRoutingModule }   from './listing-routing.module';

import { AgmCoreModule }        from 'angular2-google-maps/core';
import { SelectModule }         from 'ng2-select';

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDrNC8S7aRj9MdOZBXVKq6vVaRhg2uLalo',
      libraries: ['places']
    }),
    CommonModule,
    ListingRoutingModule,
    ReactiveFormsModule,
    SelectModule
  ],
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
