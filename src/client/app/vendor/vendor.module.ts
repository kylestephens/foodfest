import { NgModule }             from '@angular/core';
import { VendorComponent }      from './vendor.component';
import { VendorRoutingModule }  from './vendor-routing.module';
import { SharedModule }         from '../shared/shared.module';
import { ServicesModule }       from '../services/services.module';
import { AgmCoreModule }        from 'angular2-google-maps/core';

@NgModule({
  imports: [
    VendorRoutingModule,
    SharedModule,
    ServicesModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyDrNC8S7aRj9MdOZBXVKq6vVaRhg2uLalo'})
  ],
  declarations: [VendorComponent],
  exports: [VendorComponent],
  providers: []
})
export class VendorModule {}
