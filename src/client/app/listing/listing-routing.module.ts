import { NgModule }                 from '@angular/core';
import { RouterModule }             from '@angular/router';
import { ListingMasterComponent }   from './listing-master.component';
import { ListingDetailComponent }   from './detail/listing-detail.component';
import { CreateListingComponent }   from './create-listing.component';
import { CreateListingStepOneComponent }   from './steps/one/create-listing-step-one.component';
import { CreateListingStepTwoComponent }   from './steps/two/create-listing-step-two.component';
import { CreateListingStepThreeComponent } from './steps/three/create-listing-step-three.component';
import { CreateListingStepFourComponent }  from './steps/four/create-listing-step-four.component';
import { VendorPageComponent }             from './vendorPage/vendor-page.component';
import { CONSTANT }                 from '../core/constant';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'list-with-us', component: ListingMasterComponent,
        children: [
          { path: '', redirectTo: 'details', pathMatch: 'full' },
          { path: 'details', component: ListingDetailComponent },
          { path: 'create-listing', component: CreateListingComponent,
            children: [
              { path: '', redirectTo: 'step-1', pathMatch: 'full' },
              { path: 'step-1', component: CreateListingStepOneComponent },
              { path: 'step-2', component: CreateListingStepTwoComponent },
              { path: 'step-3', component: CreateListingStepThreeComponent },
              { path: 'step-4', component: CreateListingStepFourComponent }
            ]
          }
          //{ path: 'make-payment', component: MakePayment }
        ]
      }, {
        path: 'vendor', component: VendorPageComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ListingRoutingModule { }
