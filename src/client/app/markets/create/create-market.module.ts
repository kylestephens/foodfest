import { NgModule }                     from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { ReactiveFormsModule }          from '@angular/forms';
import { AgmCoreModule }                from 'angular2-google-maps/core/core-module';
import { SelectModule }                 from 'ng2-select';
import { CreateMarketRoutingModule }    from './create-market-routing.module';
import { CreateMarketComponent }        from './create-market.component';
import { CreateMarketService }          from './create-market.service';
import { CreateMarketStepOneComponent } from './steps/one/create-market-step-one.component';
import { CreateMarketStepTwoComponent } from './steps/two/create-market-step-two.component';
import { SharedModule }                 from '../../shared/shared.module';


@NgModule({
  imports: [
    AgmCoreModule,
    CommonModule,
    CreateMarketRoutingModule,
    ReactiveFormsModule,
    SelectModule,
    SharedModule
  ],
  declarations: [
    CreateMarketComponent,
    CreateMarketStepOneComponent,
    CreateMarketStepTwoComponent
  ],
  providers: [ CreateMarketService ]
})

export class CreateMarketModule { }
