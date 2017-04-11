import { Component }        from '@angular/core';
import { Router }           from '@angular/router';
import { AccountService }   from '../../services/account.service';
import { RestService }      from '../../services/rest.service';
import { SettingsService }  from '../../services/settings.service';

/**
 * This class represents the lazy loaded ListingComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-listing-payment',
  templateUrl: 'listing-payment.component.html',
  styleUrls: ['listing-payment.component.css']
})
export class ListingPaymentComponent {

  private planType: number;

  constructor(
    private accountService: AccountService,
    private restService: RestService,
    private settingsService: SettingsService,
    private router: Router
  ) {};

  openCheckout(planNum: number) {
    var me = this,
      _description = '',
      _amount = 0,
      _planName = '';

    if(planNum === 1) {
      _description = 'Monthly Subscription';
      _amount = 2500;
      _planName = 'monthly';
    } else if(planNum === 2) {
      _description = 'Annual Subscription';
      _planName = 'annual';
      _amount = 20400;  // 17 x 12
    } else if(planNum === 3) {
      _description = '6 Monthly Subscription';
      _amount = 12000;
      _planName = 'biannual';
    }

    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_2mzBqvbawC9czSPnTGjM4pnA',
      email: me.accountService.getUser().email,
      image: me.settingsService.getBaseUrl() + '/assets/img/icon.png',
      locale: 'auto',
      currency: 'eur',
      panelLabel: 'Subscribe',
      token: function (token: any) {
        debugger;
        let planDetails = {
          stripeId: token.id,
          userId: me.accountService.getUser().id,
          businessName: me.accountService.getVendor().business_name,
          planName: _planName
        };
        me.restService.post(me.settingsService.getServerBaseUrl() + '/subscribe',
          planDetails, (resp: any) => {
            debugger;
        });
      }
    });

    handler.open({
      name: 'Foodfest',
      description: _description,
      amount: _amount
    });
  };

}
