import { NgModule }                 from '@angular/core';
import { CommonModule }             from '@angular/common';
import { Ng2PaginationModule }      from 'ng2-pagination';
import { MarketsComponent }         from './markets.component';
import { MarketsRoutingModule }     from './markets-routing.module';
import { MarketService }            from './market.service';
import { MarketCardComponent }      from './card/market-card.component';

@NgModule({
  imports: [ Ng2PaginationModule, CommonModule, MarketsRoutingModule ],
  declarations: [ MarketsComponent, MarketCardComponent ],
  exports: [ MarketsComponent ],
  providers: [ MarketService ]
})

export class MarketsModule { }
