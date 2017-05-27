import { NgModule }             from '@angular/core';
import { VendorComponent }      from './vendor.component';
import { VendorRoutingModule }  from './vendor-routing.module';
import { SharedModule }         from '../shared/shared.module';
import { AgmCoreModule }        from 'angular2-google-maps/core/core-module';

@NgModule({
  imports: [
    AgmCoreModule,
    VendorRoutingModule,
    SharedModule
  ],
  declarations: [VendorComponent],
  exports: [ VendorComponent],
  providers: []
})
export class VendorModule {}
