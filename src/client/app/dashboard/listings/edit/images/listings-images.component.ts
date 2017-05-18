import {
  Component,
  Input,
  NgZone,
  OnInit,
  OnChanges
}                                        from '@angular/core';

import { CONSTANT }                      from '../../../../core/constant';

import { Vendor }                        from '../../../../shared/model/vendor';
import { AccountService }                from '../../../../services/account.service';
import { LoaderService }                 from '../../../../services/loader.service';
import { MessagingService }              from '../../../../services/messaging.service';
import { RestService }                   from '../../../../services/rest.service';
import { SettingsService }               from '../../../../services/settings.service';

/**
 * This class represents the lazy loaded listing edits component
 */
@Component({
  moduleId: module.id,
  selector: 'ak-listings-images',
  templateUrl: 'listings-images.component.html',
  styleUrls: ['listings-images.component.css']
})

export class ListingsImagesComponent implements OnInit, OnChanges {

  @Input()
  vendor: Vendor;

  public editingVendor: Vendor;

  public businessLogo: Object = null;
  public coverImage: Object = null;
  public additionalImages: Array<Object> = [];

  private maxImagesExceeded: boolean = false;
  private MAX_NUM_IMAGES: number = 8;

  private serverUrl: string = this.settingsService.getServerBaseUrl() + '/';

  constructor(
    private accountService: AccountService,
    private loaderService: LoaderService,
    private messagingService: MessagingService,
    private ngZone: NgZone,
    private restService: RestService,
    private settingsService: SettingsService
  ) {};

  ngOnInit() {
    this.editingVendor = this.vendor;
  };

  ngOnChanges(changes: any) {
    if(changes.vendor && changes.vendor.currentValue) {
      this.editingVendor = changes.vendor.currentValue;
    }
  };

  /**
   * Convert cover image file into base64 encoded file
   */
  public onChangeCover = function(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      var me = this,
        reader = new FileReader();

      reader.onload = function (e : any) {
        me.coverImage = e.target.result;
      }

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  };

  /**
   * Convert logo image file into base64 encoded file
   */
  public onChangeLogo = function(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      var me = this,
        reader = new FileReader();

      reader.onload = function (e : any) {
        me.businessLogo = e.target.result;
      }

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  };

  /**
   * Convert extra image files into array of
   * base64 encoded files
   */
  public onChangeImages = function(fileInput: any) {
    this.maxImagesExceeded = false;
    if(fileInput.target.files && fileInput.target.files.length < this.MAX_NUM_IMAGES) {
      var me = this;

      for(var image of fileInput.target.files) {
        this.ngZone.run(() => {
          var reader = new FileReader();
          reader.onload = function (e : any) {
            me.additionalImages.push(e.target.result);
          }
          reader.readAsDataURL(image);
        });
      }
    } else if (fileInput.target.files && fileInput.target.files.length > this.MAX_NUM_IMAGES) {
      this.maxImagesExceeded = true;
    }
  };

  /**
   * Upload the cover image only
   */
  public onClickUploadCover() {
    this.loaderService.show();
    this.restService.post(
      this.settingsService.getServerBaseUrl() + '/vendors/images/cover', {
        id: this.editingVendor.id,
        cover_photo: this.coverImage
      }, this.accountService.getUser().akAccessToken
    ).then((response: any) => {
      this.loaderService.hide();
      let responseBody = response.json();
      this.editingVendor.cover_photo_path = responseBody.cover_photo + '?t=' + Date.now();  // cache busting
      this.vendor = this.editingVendor;
      this.messagingService.show(
        'listings-description-images',
        CONSTANT.MESSAGING.SUCCESS,
        'Image successfully uploaded',
        true
      );
    }, (reason: any) => {
      this.loaderService.hide();
      this.messagingService.show(
        'listings-details-cover',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR,
        true
      );
    });
  };

  /**
   * Upload the logo image only
   */
  public onClickUploadLogo() {
    this.loaderService.show();
    this.restService.post(
      this.settingsService.getServerBaseUrl() + '/vendors/images/logo', {
        id: this.editingVendor.id,
        logo_photo: this.businessLogo
      }, this.accountService.getUser().akAccessToken
    ).then((response: any) => {
      this.loaderService.hide();
      let responseBody = response.json();
      this.editingVendor.logo_path = responseBody.logo_photo + '?t=' + Date.now();  // cache busting
      this.vendor = this.editingVendor;
    }, (reason: any) => {
      this.loaderService.hide();
      this.messagingService.show(
        'listings-details-logo',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR,
        true
      );
    });
  };

  /**
   * Upload additional images
   */
  public onClickUploadImages() {
    this.loaderService.show();
    this.restService.post(
      this.settingsService.getServerBaseUrl() + '/vendors/images/additional', {
        id: this.editingVendor.id,
        images: this.additionalImages
      }, this.accountService.getUser().akAccessToken
    ).then((response: any) => {
      this.loaderService.hide();
      let responseBody = response.json();
      this.editingVendor.images = responseBody.images;
      this.vendor = this.editingVendor;
      this.messagingService.show(
        'listings-description-images',
        CONSTANT.MESSAGING.SUCCESS,
        'Image upload successful',
        true
      );
    }, (reason: any) => {
      this.loaderService.hide();
      this.messagingService.show(
        'listings-details-images',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR,
        true
      );
    });
  };

  /**
   * Remove a particular image from list
   * of currently uploaded additional images
   */
  public onClickRemoveImage(index: number) {
    this.loaderService.show();
    this.restService.post(
      this.settingsService.getServerBaseUrl() + '/vendors/image/remove', {
        id: this.editingVendor.id,
        image_index: index,
        num_photos: this.editingVendor.images.length
      }, this.accountService.getUser().akAccessToken
    ).then((response: any) => {
      this.loaderService.hide();
      let responseBody = response.json();
      this.editingVendor.images = responseBody.images;
      this.vendor = this.editingVendor;
      this.messagingService.show(
        'listings-description-images',
        CONSTANT.MESSAGING.SUCCESS,
        'Image successfully removed',
        true
      );
    }, (reason: any) => {
      this.loaderService.hide();
      this.messagingService.show(
        'listings-details-images',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR,
        true
      );
    });
  };

}
