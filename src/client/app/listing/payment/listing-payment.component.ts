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

  @ViewChild('applyCouponInput')
  public couponCodeInputRef: ElementRef;

  @ViewChild('pricingDisplay')
  public pricingDisplayDivRef: ElementRef;

  @ViewChild('applyCouponBtn')
  public applyCouponBtnRef: ElementRef;

  @ViewChild('applyCouponSuccess')
  public applyCouponSuccessRef: ElementRef;

  @ViewChild('applyCouponFail')
  public applyCouponFailRef: ElementRef;

  @ViewChild('freeDisplay')
  public freeDisplayRef: ElementRef;

  public isEditing: boolean = false;
  public isPaid: boolean = false;
  public vendorId: number;
  public couponCode: string = '';

  // Monthly rate equivalents for the different plans
  public MONTHLY_PLAN = 2500;
  public QUARTERLY_PLAN = 2000;
  public ANNUAL_PLAN = 1700;

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
    if(this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.LISTING_EDIT)) {
      this.isEditing = true;
    }
  };

  public openCheckout(planNum: number) {
    var me = this,
      _description = '',
      _amount = 0,
      _planName = '';

    if(planNum === 1) {
      _description = 'Monthly Rolling Subscription';
      _amount = this.MONTHLY_PLAN;
      _planName = 'monthly';
    } else if(planNum === 2) {
      _description = 'Annual Rolling Subscription';
      _planName = 'annual';
      _amount = this.ANNUAL_PLAN * 12;
    } else if(planNum === 3) {
      _description = '3 Monthly Rolling Subscription';
      _amount = this.QUARTERLY_PLAN * 3;
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
      allowRememberMe: false,

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
          me.settingsService.getServerBaseUrl() + '/account/subscribe',
          planDetails,
          me.accountService.getUser().akAccessToken
        ).then((resp: any) => {
          me.loaderService.hide();
          let updatedVendor = me.accountService.getVendorById(vendorId);

          let _response = resp.json();
          if(_response && _response.id) {
            me.isPaid = true;
            updatedVendor.active_vendor = 1;
            me.accountService.updateVendor(updatedVendor);
            me.accountService.clearListingStorage();
            setTimeout(() => {
              me.renderer.addClass(me.tickAnimationElementRef.nativeElement, 'drawn');
            }, 300);
            this.accountService.refreshNotifications();
          }
        }, (reason: any) => {
          this._onServerError(reason);
        });

      }

    });

    handler.open({
      name: 'Foodfest',
      description: _description,
      amount: _amount
    });
  };

  public onClickApplyCoupon() {
    this.couponCode = this.couponCodeInputRef.nativeElement.value;
    this.restService.post(
      this.settingsService.getServerBaseUrl() + '/account/checkcoupon',
      { couponCode: this.couponCode },
      this.accountService.getUser().akAccessToken
    ).then((resp: any) => {
      this.loaderService.hide();
      let _response = resp.json();
      if(_response == true) {
        this._applyCoupon();
      } else {
        this._invalidCoupon();
      }
    }, (reason: any) => {
      this._onServerError(reason);
    });
  };

  public onPublishFree() {
    this.restService.post(
      this.settingsService.getServerBaseUrl() + '/account/publishfree', {
        couponCode: this.couponCode,
        vendorId: this.vendorId
      }, this.accountService.getUser().akAccessToken
    ).then((resp: any) => {
      let updatedVendor = this.accountService.getVendorById(this.vendorId);

      let _response = resp.json();
      if(_response == true) {
        this.isPaid = true;
        updatedVendor.active_vendor = 1;
        this.accountService.updateVendor(updatedVendor);
        this.accountService.clearListingStorage();
        setTimeout(() => {
          this.renderer.addClass(this.tickAnimationElementRef.nativeElement, 'drawn');
        }, 300);
        this.accountService.refreshNotifications();
      }
    }, (reason: any) => {
      this._onServerError(reason);
    });
  };

  private _onServerError(reason: any) {
    this.loaderService.hide();
    this.messagingService.show(
      'global',
      CONSTANT.MESSAGING.ERROR,
      reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR
    );
  };

  private _applyCoupon() {
    this.renderer.addClass(this.pricingDisplayDivRef.nativeElement, 'hidden');
    this.renderer.setAttribute(this.couponCodeInputRef.nativeElement, 'disabled', 'true');
    this.renderer.addClass(this.applyCouponBtnRef.nativeElement, 'hidden');
    this.renderer.addClass(this.applyCouponFailRef.nativeElement, 'hidden');
    this.renderer.removeClass(this.applyCouponSuccessRef.nativeElement, 'hidden');
    this.renderer.removeClass(this.freeDisplayRef.nativeElement, 'hidden');
  };

  private _invalidCoupon() {
    this.renderer.removeClass(this.applyCouponFailRef.nativeElement, 'hidden');
  };

}
