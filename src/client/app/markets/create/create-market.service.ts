import { Injectable }        from '@angular/core';
import { Response }          from '@angular/http';
import { Observable }        from 'rxjs';
import { Subject }           from 'rxjs/Subject';
import { RestService }       from '../../services/rest.service';
import { SettingsService }   from '../../services/settings.service';
import { AccountService }    from '../../services/account.service';
import { MessagingService }  from '../../services/messaging.service';
import { CONSTANT }          from '../../core/constant';
import { County }            from '../../shared/model/county';
//TODO: ADD HANDLING WHEN USER IS organisation
@Injectable()
export class CreateMarketService {
  private subject = new Subject<any>();
  private storedMarket: any = { firstStep: null, secondStep: null };

  constructor(
    private restService: RestService,
    private settingsService: SettingsService,
    private accountService: AccountService,
    private messagingService: MessagingService
  ) {};

  nextStep = function() {
    console.debug('CreateMarketService::nextStep');
    this.subject.next({
      event: CONSTANT.EVENT.CREATE_MARKET.NEXT_STEP
    });
  };

  previousStep = function() {
    console.debug('CreateMarketService::previousStep');
    this.subject.next({
      event: CONSTANT.EVENT.CREATE_MARKET.PREVIOUS_STEP
    });
  };

    /**
  * Send message as observable
  */
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  };

  getStoredMarket() {
    return this.storedMarket;
  }

  setStoredMarket(values: any, step: number) {
    if(step === 1) this.storedMarket.firstStep = values;
    else if(step === 2) this.storedMarket.secondStep = values;
  }

  resetStoredMarket() {
    this.storedMarket.firstStep = null;
    this.storedMarket.secondStep = null;
  }

  getCounties(): Promise<County[]> {
    return this.restService.get(
      this.settingsService.getServerBaseUrl() + '/counties'
    ).then((response: Response) => response.json() as County[] );
  }

  createMarket(): Promise<number> {
    let market = {},
        firstStep: any = {},
        openingDays;

    Object.assign(firstStep, this.getStoredMarket().firstStep);
    openingDays = firstStep.marketOpeningDays.filter((marketOpeningDay: any) => marketOpeningDay.checked);

    for(let openingDay of openingDays) {
      openingDay.timeFrom = openingDay.timeFrom ? openingDay.timeFrom[0].text : null;
      openingDay.timeTo = openingDay.timeTo ? openingDay.timeTo[0].text : null;
    }

    firstStep.marketOpeningDays = openingDays;

    Object.assign(market, firstStep, this.getStoredMarket().secondStep);
    return this.restService.post(
      this.settingsService.getServerBaseUrl() + '/markets/create', market, this.accountService.getUser().akAccessToken
    ).then(
    (response: Response) => {
      this.resetStoredMarket();
      return response.json();
    }).catch(
    (reason: any) => {
      this.messagingService.show(
        'create-market',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR,
        true
      );
    });
  }

};


