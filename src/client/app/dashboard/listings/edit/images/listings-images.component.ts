import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation
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
  styleUrls: ['listings-images.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ListingsImagesComponent implements OnInit {

  @Input()
  vendor: Vendor;

  public editingVendor: Vendor;

  public businessLogo: Object = null;
  public coverImage: Object = null;
  public additionalImages: Array<Object> = [];

  private serverUrl: string = this.settingsService.getServerBaseUrl() + '/';

  constructor(
    private accountService: AccountService,
    private loaderService: LoaderService,
    private messagingService: MessagingService,
    private restService: RestService,
    private settingsService: SettingsService
  ) {};

  ngOnInit() {
    this.editingVendor = this.vendor;
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
      this.editingVendor.logo_path = responseBody.business_logo + '?t=' + Date.now();  // cache busting
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

}
