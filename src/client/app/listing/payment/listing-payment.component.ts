import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild
}                             from '@angular/core';
import { Router }             from '@angular/router';
import { AccountService }     from '../../services/account.service';
import { LoaderService }      from '../../services/loader.service';
import { MessagingService }   from '../../services/messaging.service';
import { RestService }        from '../../services/rest.service';
import { SettingsService }    from '../../services/settings.service';
import { CONSTANT }           from '../../core/constant';
import {
  LocalStorageService
}                             from 'ng2-webstorage';

/**
 * This class represents the lazy loaded ListingComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-listing-payment',
  templateUrl: 'listing-payment.component.html',
  styleUrls: ['listing-payment.component.css']
})
export class ListingPaymentComponent implements OnInit {

  @ViewChild('tickAnimation')
  public tickAnimationElementRef: ElementRef;

  public isPaid: boolean = false;
  public vendorId: number;

  private planType: number;

  constructor(
    private accountService: AccountService,
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService,
    private messagingService: MessagingService,
    private restService: RestService,
    private settingsService: SettingsService,
    private renderer: Renderer2,
    private router: Router
  ) {
    this.vendorId = this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.VENDOR_ID);
  };

  ngOnInit() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://checkout.stripe.com/checkout.js';
    document.head.appendChild(script);
  };

  openCheckout(planNum: number) {
    var me = this,
      _description = '',
      _amount = 0,
      _planName = '';

    if(planNum === 1) {
      _description = 'Monthly Rolling Subscription';
      _amount = 2500;
      _planName = 'monthly';
    } else if(planNum === 2) {
      _description = 'Annual Rolling Subscription';
      _planName = 'annual';
      _amount = 20400;  // 17 x 12
    } else if(planNum === 3) {
      _description = '3 Monthly Rolling Subscription';
      _amount = 6000;  // 20 x 3
      _planName = 'quarterly';
    }

    /**
     * TODO: SSL / https required (https://goo.gl/zmWq3m)
     * TODO: Change key when go live
     */
    var handler = (<any>window).StripeCheckout.configure({

      key: 'pk_test_2mzBqvbawC9czSPnTGjM4pnA',
      email: me.accountService.getUser().email,
      image: me.settingsService.getBaseUrl() + '/assets/img/icon.png',
      locale: 'auto',
      currency: 'eur',
      panelLabel: 'Subscribe',

      token: (token: any) => {

        let stepOne = me.localStorageService.retrieve(
          CONSTANT.LOCALSTORAGE.LISTING_STEP_ONE
        );
        let vendorId = me.localStorageService.retrieve(
          CONSTANT.LOCALSTORAGE.VENDOR_ID
        );
        let planDetails = {
          stripeId: token.id,
          businessName: stepOne.businessName,
          vendorId: vendorId,
          planName: _planName
        };

        me.loaderService.show();

        me.restService.post(
          me.settingsService.getServerBaseUrl() + '/subscribe',
          planDetails,
          me.accountService.getUser().akAccessToken
        ).then((resp: any) => {
          me.loaderService.hide();

          let _response = resp.json();
          if(_response && _response.id) {
            me.isPaid = true;
            me.accountService.clearListingStorage();
            setTimeout(() => {
              me.renderer.addClass(me.tickAnimationElementRef.nativeElement, 'drawn');
            }, 300);
          }
        }, (reason: any) => {
          me.loaderService.hide();

          me.messagingService.show(
            'global',
            CONSTANT.MESSAGING.ERROR,
            reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR
          );
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
