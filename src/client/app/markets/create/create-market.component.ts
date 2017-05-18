import { Component, OnInit }   from '@angular/core';
import { Subscription }        from 'rxjs/Subscription';
import { CONSTANT }            from '../../core/constant';
import { CreateMarketService } from './create-market.service';
import { Router }              from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'ak-create-market',
  templateUrl: 'create-market.component.html',
  styleUrls: ['create-market.component.css']
})

export class CreateMarketComponent implements OnInit {
  public currentStep: number = 1;
  private navSubscription: Subscription;
  private routeSubscription: Subscription;

  constructor (
    private createMarketService: CreateMarketService,
    private router: Router) {
    this.currentStep = 1;

    this.routeSubscription = this.router.events.subscribe((val: any) => {
      if(val.url && val.url.split('/')[2] === 'create-market' && val.url && val.url.split('/')[3] && val.url.split('/')[3].indexOf('step-') > -1) {
        if(parseInt(val.url.slice(-1)) > 1 && !this.createMarketService.getStoredMarket().firstStep) {
          console.debug(`
            CreateMarketComponent::routeSubscription - Invalid route\n
            Returning to Step 1.
          `);
          this.router.navigate(
            ['markets/create-market/step-1']
          );
        } else {
          this.currentStep = parseInt(val.url.slice(-1));
        }
      }
    });

    // subscribe to modal service messages
    this.navSubscription = this.createMarketService.getMessage().subscribe(subMessage => {
      console.debug('CreateMarketComponent::subscription');
      if(subMessage.event && subMessage.event === CONSTANT.EVENT.CREATE_MARKET.NEXT_STEP) {
        this._nextStep();
      }
      if(subMessage.event && subMessage.event === CONSTANT.EVENT.CREATE_MARKET.PREVIOUS_STEP) {
        this._previousStep();
      }
    });
  }

  ngOnInit() {
    this.currentStep = 1;
  }

  ngOnDestroy() {
    this.navSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  private _previousStep = function() {
    this.currentStep--;
    this.router.navigate(['markets/create-market/step-' + this.currentStep]);
    window.document.getElementsByClassName('page-body')[0].scrollIntoView();
  };

  private _nextStep = function() {
    this.currentStep++;
    this.router.navigate(['markets/create-market/step-' + this.currentStep]);
    window.document.getElementsByClassName('page-body')[0].scrollIntoView();
  };
}


