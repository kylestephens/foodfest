import { Injectable }         from '@angular/core';
import { Observable }         from 'rxjs';
import { Subject }            from 'rxjs/Subject';
import { CONSTANT }           from '../core/constant';
import { MessagingService }   from '../services/messaging.service';
import { RestService }        from '../services/rest.service';
import { SettingsService }    from '../services/settings.service';
import {
  LocalStorageService,
  SessionStorageService
}                             from 'ng2-webstorage';

@Injectable()
export class CreateListingService {

  private subject = new Subject<any>();

  constructor(
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

      this.restService.post(
        me.settingsService.getServerBaseUrl() + '/vendors/create', {
          id: null,
          user_id: '1',
          business_name: stepOne.businessName,
          business_type: stepOne.businessType,
          phone_number: stepTwo.phoneNumber,
          description: stepFour.businessDescription,
          event_type: stepOne.eventType,
          business_setup: stepOne.businessSetup,
          styles: stepOne.styles,
          diet_requirements: stepOne.dietRequirements,
          logo_path: stepFour.businessLogo,
          images_path: stepFour.businessAdditionalImages,
          cover_photo_path: stepFour.businessCoverImage
        }
      ).then(function(response: any) {
        let responseBody = response.json();
        resolve(responseBody);
        debugger;
      }, function(reason: any) {
        debugger;
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
          business_logo: businessLogo,
          cover_image: coverImage,
          images: additionalImages
        }
      ).then(function(response: any) {
        let responseBody = response.json();
        resolve(responseBody);
        debugger;
      }, function(reason: any) {
        debugger;
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
