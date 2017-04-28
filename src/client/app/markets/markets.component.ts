import { Component, OnInit }   from '@angular/core';
import { MarketService }       from './market.service';
import { Market }              from '../shared/model/market';

/**
 * This class represents the lazy loaded Markets component.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-markets',
  templateUrl: 'markets.component.html',
  styleUrls: ['markets.component.css']
})
export class MarketsComponent implements OnInit {
  markets: Market[];
  loaded: boolean = false;

  constructor(
    private marketService: MarketService
  )
  {}

  ngOnInit(): void {
    this.getMarkets();
  }

  getMarkets(): void {
    this.marketService.getMarkets().then(markets => {
      this.loaded = true;
      this.markets = markets;
    });
  }
}
