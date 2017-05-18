import { NgModule }                 from '@angular/core';
import { Ng2PaginationModule }      from 'ng2-pagination';
import { MarketsRoutingModule }     from './markets-routing.module';
import { MarketService }            from './market.service';
import { MarketsComponent }         from './markets.component';
import { MarketCardComponent }      from './card/market-card.component';
import { SharedModule }             from '../shared/shared.module';

@NgModule({
  imports: [
    MarketsRoutingModule,
    Ng2PaginationModule,
    SharedModule
  ],
  declarations: [
    MarketsComponent,
    MarketCardComponent
  ],
  providers: [ MarketService ]
})

export class MarketsModule { }
