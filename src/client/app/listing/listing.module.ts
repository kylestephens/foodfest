import { NgModule }                        from '@angular/core';
import { CommonModule }                    from '@angular/common';
import { ReactiveFormsModule }             from '@angular/forms';
import { CreateListingComponent }          from './create-listing.component';
import { CreateListingService }            from './create-listing.service';
import { CreateListingStepOneComponent }   from './steps/one/create-listing-step-one.component';
import { CreateListingStepTwoComponent }   from './steps/two/create-listing-step-two.component';
import { CreateListingStepThreeComponent } from './steps/three/create-listing-step-three.component';
import { CreateListingStepFourComponent }  from './steps/four/create-listing-step-four.component';
import { CreateListingStepFiveComponent }  from './steps/five/create-listing-step-five.component';
import { ListingDetailComponent }          from './detail/listing-detail.component';
import { ListingPaymentComponent }         from './payment/listing-payment.component';
import { ListingMasterComponent }          from './listing-master.component';
import { ListingRoutingModule }            from './listing-routing.module';

import { SharedModule }                    from '../shared/shared.module';
import { SelectModule }                    from 'ng2-select';
import { AgmCoreModule }                   from 'angular2-google-maps/core/core-module';

@NgModule({
  imports: [
    AgmCoreModule,
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
    CreateListingStepFiveComponent,
    ListingDetailComponent,
    ListingPaymentComponent,
    ListingMasterComponent
  ],
  exports: [
    CreateListingComponent,
    CreateListingStepOneComponent,
    CreateListingStepTwoComponent,
    CreateListingStepThreeComponent,
    CreateListingStepFourComponent,
    CreateListingStepFiveComponent,
    ListingDetailComponent,
    ListingPaymentComponent,
    ListingMasterComponent
  ],
  providers: [
    CreateListingService
  ]
})

export class ListingModule { }
