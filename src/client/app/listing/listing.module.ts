import { NgModule }               from '@angular/core';
import { CommonModule }           from '@angular/common';
import { ReactiveFormsModule }    from '@angular/forms';
import { CreateListingComponent } from './create-listing.component';
import { CreateListingService }   from './create-listing.service';
import { CreateListingStepOneComponent }   from './steps/one/create-listing-step-one.component';
import { CreateListingStepTwoComponent }   from './steps/two/create-listing-step-two.component';
import { CreateListingStepThreeComponent } from './steps/three/create-listing-step-three.component';
import { CreateListingStepFourComponent }  from './steps/four/create-listing-step-four.component';
import { ListingDetailComponent }   from './detail/listing-detail.component';
import { ListingPaymentComponent }  from './payment/listing-payment.component';
import { ListingMasterComponent }   from './listing-master.component';
import { VendorPageComponent }      from './vendorPage/vendor-page.component';
import { ListingRoutingModule }     from './listing-routing.module';

import { SharedModule }             from '../shared/shared.module';

import { AgmCoreModule }            from 'angular2-google-maps/core';
import { SelectModule }             from 'ng2-select';

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDrNC8S7aRj9MdOZBXVKq6vVaRhg2uLalo',
      libraries: ['places']
    }),
    CommonModule,
    ListingRoutingModule,
    ReactiveFormsModule,
    SelectModule,
    SharedModule
  ],
  declarations: [
    CreateListingComponent,
    CreateListingStepOneComponent,
    CreateListingStepTwoComponent,
    CreateListingStepThreeComponent,
    CreateListingStepFourComponent,
    ListingDetailComponent,
    ListingPaymentComponent,
    ListingMasterComponent,
    VendorPageComponent
  ],
  exports: [
    CreateListingComponent,
    CreateListingStepOneComponent,
    CreateListingStepTwoComponent,
    CreateListingStepThreeComponent,
    CreateListingStepFourComponent,
    ListingDetailComponent,
    ListingPaymentComponent,
    ListingMasterComponent,
    VendorPageComponent
  ],
  providers: [
    CreateListingService
  ]
})

export class ListingModule { }
