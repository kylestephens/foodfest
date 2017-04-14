import { NgModule }             from '@angular/core';
import { VendorComponent }      from './vendor.component';
import { VendorRoutingModule }  from './vendor-routing.module';
import { SharedModule }         from '../shared/shared.module';
import { ServicesModule }       from '../services/services.module';
import { AgmCoreModule }        from 'angular2-google-maps/core';

@NgModule({
  imports: [
    AgmCoreModule,
    VendorRoutingModule,
    SharedModule,
    ServicesModule
  ],
  declarations: [VendorComponent],
  exports: [ VendorComponent],
  providers: []
})
export class VendorModule {}
