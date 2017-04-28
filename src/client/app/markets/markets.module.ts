import { NgModule }                 from '@angular/core';
import { CommonModule }             from '@angular/common';
import { MarketsComponent }         from './markets.component';
import { MarketsRoutingModule }     from './markets-routing.module';
import { MarketService }            from './market.service';

@NgModule({
  imports: [ CommonModule, MarketsRoutingModule ],
  declarations: [ MarketsComponent ],
  exports: [ MarketsComponent ],
  providers: [ MarketService ]
})

export class MarketsModule { }
