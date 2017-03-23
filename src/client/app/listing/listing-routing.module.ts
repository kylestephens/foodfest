import { NgModule }               from '@angular/core';
import { RouterModule }           from '@angular/router';
import { ListingMasterComponent } from './listing-master.component';
import { ListingDetailComponent } from './listing-detail.component';
import { CreateListingComponent } from './create-listing.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'list-with-us', component: ListingMasterComponent,
        children: [
          { path: '', redirectTo: 'details', pathMatch: 'full' },
          { path: 'details', component: ListingDetailComponent },
          { path: 'create-listing', component: CreateListingComponent }
          //{ path: 'make-payment', component: MakePayment }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ListingRoutingModule { }
