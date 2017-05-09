import {
  Component,
  ElementRef,
  Renderer2,
  ViewChild
}                             from '@angular/core';
import { Router }             from '@angular/router';
import { AccountService }     from '../../services/account.service';
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
export class ListingPaymentComponent {

  @ViewChild('tickAnimation')
  public tickAnimationElementRef: ElementRef;

  public isPaid: boolean = false;
  public vendorId: number;

  private planType: number;

  constructor(
    private accountService: AccountService,
    private localStorageService: LocalStorageService,
    private messagingService: MessagingService,
    private restService: RestService,
    private settingsService: SettingsService,
    private renderer: Renderer2,
    private router: Router
  ) {
    this.vendorId = this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.VENDOR_ID);
  };

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

        let stepOne = this.localStorageService.retrieve(
          CONSTANT.LOCALSTORAGE.LISTING_STEP_ONE
        );
        let planDetails = {
          stripeId: token.id,
          businessName: stepOne.businessName,
          planName: _planName
        };

        me.restService.post(
          me.settingsService.getServerBaseUrl() + '/subscribe',
          planDetails, this.accountService.getUser().akAccessToken
        ).then(
          (resp: any) => {
            let _response = resp.json();
            if(_response && _response.id) {
              this.isPaid = true;
              this._clearLocalStorage();
              setTimeout(() => {
                this.renderer.addClass(this.tickAnimationElementRef.nativeElement, 'drawn');
              }, 300);
            }
          },
          (reason: any) => {
            this.messagingService.show(
              'global',
              CONSTANT.MESSAGING.ERROR,
              reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR
            );
          }
        );

      }

    });

    handler.open({
      name: 'Foodfest',
      description: _description,
      amount: _amount
    });
  };

  /**
   * Clear down the local storage objects that were used to
   * persist state across the various listing screens
   */
  private _clearLocalStorage() {
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.LISTING_STEP_ONE
    );
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.LISTING_STEP_TWO
    );
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.LISTING_STEP_THREE
    );
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.LISTING_STEP_FOUR
    );
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.LISTING_STEP_FIVE
    );
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.VENDOR_ID
    );
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.VENDOR_IMAGES
    );
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.LISTING_ADDRESS
    );
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.LISTING_EDIT
    );
  };

}
