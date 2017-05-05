import { Injectable }         from '@angular/core';
import { Observable }         from 'rxjs';
import { Subject }            from 'rxjs/Subject';
import { CONSTANT }           from '../core/constant';
import { MessagingService }   from '../services/messaging.service';
import { RestService }        from '../services/rest.service';
import { AccountService }     from '../services/account.service';
import { SettingsService }    from '../services/settings.service';
import {
  LocalStorageService
}                             from 'ng2-webstorage';

@Injectable()
export class CreateListingService {

  private subject = new Subject<any>();

  constructor(
    private accountService: AccountService,
    private localStorageService: LocalStorageService,
    private messagingService: MessagingService,
    private restService: RestService,
    private settingsService: SettingsService
  ) {};

  public nextStep = function() {
    console.debug('CreateListingService::nextStep');
    this.subject.next({
      event: CONSTANT.EVENT.CREATE_LISTING.NEXT_STEP
    });
  };

  public previousStep = function() {
    console.debug('CreateListingService::previousStep');
    this.subject.next({
      event: CONSTANT.EVENT.CREATE_LISTING.PREVIOUS_STEP
    });
  };

  public previewListing = function(vendorId: number) {
    console.debug('CreateListingService::previewListing');
    this.subject.next({
      event: CONSTANT.EVENT.CREATE_LISTING.PREVIEW_LISTING,
      vendorId: vendorId
    });
  };

  /**
   * Create a new Vendor
   * Note: Assumes form data from create listing steps
   * have been stored in local storage
   **/
  public create = function() {
    return new Promise((resolve, reject) => {

      var me = this;

      let stepOne = this.localStorageService.retrieve(
        CONSTANT.LOCALSTORAGE.LISTING_STEP_ONE
      );
      let stepTwo = this.localStorageService.retrieve(
        CONSTANT.LOCALSTORAGE.LISTING_STEP_TWO
      );
      let stepThree = this.localStorageService.retrieve(
        CONSTANT.LOCALSTORAGE.LISTING_STEP_THREE
      );
      let stepFour = this.localStorageService.retrieve(
        CONSTANT.LOCALSTORAGE.LISTING_STEP_FOUR
      );
      let stepFive = this.localStorageService.retrieve(
        CONSTANT.LOCALSTORAGE.LISTING_STEP_FIVE
      );
      let addressInfo = this.localStorageService.retrieve(
        CONSTANT.LOCALSTORAGE.LISTING_ADDRESS
      );

      let lat = null;
      let lng = null;
      if(addressInfo) {
        if (typeof addressInfo.geometry.location.lat == 'function') {
          lat = addressInfo.geometry.location.lat();
          lng = addressInfo.geometry.location.lng();
        } else {
          lat = addressInfo.geometry.location.lat;
          lng = addressInfo.geometry.location.lng;
        }
      }

      this.restService.post(
        me.settingsService.getServerBaseUrl() + '/vendors/create', {
          id: null,
          user_id: this.accountService.getUser().id,
          business_name: stepOne.businessName,
          business_address: stepTwo.businessAddress,
          business_latitude: lat,
          business_longitude: lng,
          business_website: stepTwo.businessWebsite,
          facebook_address: stepThree.facebookAddress,
          twitter_address: stepThree.twitterAddress,
          instagram_address: stepThree.instagramAddress,
          business_type: stepOne.businessType,
          phone_number: stepTwo.phoneNumber,
          description: stepFive.businessDescription,
          event_type: stepOne.eventType,
          business_setup: stepOne.businessSetup,
          styles: stepOne.styles,
          diet_requirements: stepOne.dietRequirements,
          listed_items: stepFour
        }
      ).then(function(response: any) {
        let responseBody = response.json();
        resolve(responseBody);
      }, (reason: any) => {
        reject(reason);
        this.messagingService.show(
          'create-listing',
          CONSTANT.MESSAGING.ERROR,
          reason.statusText ? reason.statusText : 'An unexpected error has occurred',
          true
        );
      });

    });
  };

  /**
   * Create a new Vendor
   * Note: Assumes form data from create listing steps
   * have been stored in local storage
   **/
  public edit = function(vendorId: number) {
    return new Promise((resolve, reject) => {

      var me = this;

      let stepOne = this.localStorageService.retrieve(
        CONSTANT.LOCALSTORAGE.LISTING_STEP_ONE
      );
      let stepTwo = this.localStorageService.retrieve(
        CONSTANT.LOCALSTORAGE.LISTING_STEP_TWO
      );
      let stepThree = this.localStorageService.retrieve(
        CONSTANT.LOCALSTORAGE.LISTING_STEP_THREE
      );
      let stepFour = this.localStorageService.retrieve(
        CONSTANT.LOCALSTORAGE.LISTING_STEP_FOUR
      );
      let stepFive = this.localStorageService.retrieve(
        CONSTANT.LOCALSTORAGE.LISTING_STEP_FIVE
      );
      let addressInfo = this.localStorageService.retrieve(
        CONSTANT.LOCALSTORAGE.LISTING_ADDRESS
      );

      this.restService.post(
        me.settingsService.getServerBaseUrl() + '/vendors/edit', {
          id: vendorId,
          user_id: this.accountService.getUser().id,
          business_name: stepOne.businessName,
          business_address: stepTwo.businessAddress,
          business_latitude: addressInfo.geometry.location.lat,
          business_longitude: addressInfo.geometry.location.lng,
          facebook_address: stepThree.facebookAddress,
          twitter_address: stepThree.twitterAddress,
          instagram_address: stepThree.instagramAddress,
          business_type: stepOne.businessType,
          phone_number: stepTwo.phoneNumber,
          description: stepFive.businessDescription,
          event_type: stepOne.eventType,
          business_setup: stepOne.businessSetup,
          styles: stepOne.styles,
          diet_requirements: stepOne.dietRequirements,
          listed_items: stepFour
        }
      ).then(function(response: any) {
        let responseBody = response.json();
        resolve(responseBody);
      }, (reason: any) => {
        reject(reason);
        me.messagingService.show(
          'create-listing',
          CONSTANT.MESSAGING.ERROR,
          reason.statusText ? reason.statusText : 'An unexpected error has occurred',
          true
        );
      });

    });
  };

  /**
   * Upload images for vendor
   **/
  public uploadVendorImages = function(vendorId: number, businessLogo: any, coverImage: any, additionalImages: any) {
    return new Promise((resolve, reject) => {

      var me = this;

      this.restService.postMultiPart(
        me.settingsService.getServerBaseUrl() + '/vendors/images', {
          id: vendorId,
          logo_photo: businessLogo,
          cover_photo: coverImage,
          num_photos: additionalImages.length,
          images: additionalImages
        }
      ).then(function(response: any) {
        let responseBody = response.json();
        resolve(responseBody);
      }, (reason: any) => {
        reject(reason);
        me.messagingService.show(
          'create-listing',
          CONSTANT.MESSAGING.ERROR,
          reason.statusText ? reason.statusText : 'An unexpected error has occurred',
          true
        );
      });

    });
  };

  /**
  * Send message as observable
  */
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  };

};
