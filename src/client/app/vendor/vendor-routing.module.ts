import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VendorComponent } from './vendor.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: VendorComponent }
    ])
  ],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
