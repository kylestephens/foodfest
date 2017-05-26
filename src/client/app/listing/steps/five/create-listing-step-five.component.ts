import {
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  OnInit,
  Output
}                                    from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
}                                    from '@angular/forms';
import {
  LocalStorageService
}                                    from 'ng2-webstorage';
import { FormMessagesComponent }     from '../../../shared/form-messages/form-messages.component';
import { CreateListingService }      from '../../create-listing.service';
import { SettingsService }           from '../../../services/settings.service';
import { ValidationService }         from '../../../services/validation.service';
import { AccountService }            from '../../../services/account.service';
import { LoaderService }             from '../../../services/loader.service';
import { ModalService }              from '../../../services/modal.service';
import { CONSTANT }                  from '../../../core/constant';

/**
 * This class represents the lazy loaded CreateListingComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-create-listing-step-five',
  templateUrl: 'create-listing-step-five.component.html'
})

export class CreateListingStepFiveComponent {

  public stepFiveForm: FormGroup;
  public businessLogo: Object = null;
  public coverImage: Object = null;
  public additionalImages: Array<Object> = [];

  private vendorId: number = 0;
  private maxImagesExceeded: boolean = false;
  private MAX_NUM_IMAGES: number = 10;

  constructor(
    private fb: FormBuilder,
    private createListingService: CreateListingService,
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService,
    private modalService: ModalService,
    private ngZone: NgZone,
    private settingsService: SettingsService,
    private accountService: AccountService
  ) {
    this.stepFiveForm = fb.group({
      'businessLogo': [null],
      'businessCoverImage': [null],
      'businessAdditionalImages': [null],
      'businessDescription': new FormControl('', [
        Validators.required
      ])
    });
  };

  ngOnInit() {
    var _formValues;
    if(this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.LISTING_STEP_FIVE)) {
      // user might be returning from next step
      // restore values to fields to allow them to edit their data
      _formValues = this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.LISTING_STEP_FIVE);
      this._restoreFormValues(_formValues);
    }

    // check if vendor id exists, in this case we are editing an existing vendor
    if(this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.VENDOR_ID)) {
      this.vendorId = this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.VENDOR_ID);
    }
  };

  /**
   * TODO - sorry for the ugly code :-(
   * TODO - when you have vendor ID created, all subsequent calls should use access token
   *
   * 1. Check valid
   * 2. Check whether a) new vendor or b) current vendor who is editing
   *
   * A.1 - Create vendor
   * A.2 - If images, upload images
   *
   * B.1 - Update vendor details
   * B.2 - If images, update images
   */
  public submitForm(value: any) {
    if(!this.stepFiveForm.valid || this.maxImagesExceeded) {
      // user might have hit next button without completing
      // some mandatory fields - trigger validation ! :)
      for (var i in this.stepFiveForm.controls) {
        this.stepFiveForm.controls[i].markAsTouched();
      }
      return;
    }

    var me = this;
    this.localStorageService.store(CONSTANT.LOCALSTORAGE.LISTING_STEP_FIVE, value);
    if(this.vendorId === 0) {
      // if first time around - won't have created a vendor
      this.createListingService.create().then((response: any) => {
        me.vendorId = response.id;
        me.localStorageService.store(CONSTANT.LOCALSTORAGE.VENDOR_ID, response.id);
        me.accountService.addVendor(response);
        me.accountService.updateUserType(CONSTANT.user.types.VENDOR.code);

        if(me.businessLogo || me.coverImage || me.additionalImages.length > 0) {
          me.loaderService.show();
          me.createListingService.uploadVendorImages(
            me.vendorId,
            me.businessLogo,
            me.coverImage,
            me.additionalImages
          ).then((response: any) => {
            me.loaderService.hide();
            let additionalImages: Array<string> = [];
            if(response.images && response.images.length > 0) {
              response.images.forEach((image: string) => {
                additionalImages.push(this.settingsService.getServerBaseUrl() + '/' + image);
              });
            }
            me._nextStep();
          });
        } else {
          me._nextStep();
        }
      });
    } else {
       // second time around - reviewing / editing information
       this.createListingService.edit(this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.VENDOR_ID))
       .then((response: any) => {
         if(me.businessLogo || me.coverImage || me.additionalImages.length > 0) {
           me.loaderService.show();
           me.createListingService.uploadVendorImages(
             me.vendorId,
             me.businessLogo,
             me.coverImage,
             me.additionalImages
           ).then((response: any) => {
             me.loaderService.hide();
             let additionalImages: Array<string> = [];
             if(response.images && response.images.length > 0) {
               response.images.forEach((image: string) => {
                 additionalImages.push(this.settingsService.getServerBaseUrl() + '/' + image);
               });
             }
             me._nextStep();
           });
         } else {
           me._nextStep();
         }
       });
    }
  };

  public onClickLogoTooltip = function() {
    this.modalService.show(CONSTANT.MODAL.ILLUSTRATION_LOGO);
  };

  public onClickCoverTooltip = function() {
    this.modalService.show(CONSTANT.MODAL.ILLUSTRATION_COVER);
  };

  public onClickImageTooltip = function() {
    this.modalService.show(CONSTANT.MODAL.ILLUSTRATION_IMG);
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

  public previousStep() {
    this.createListingService.previousStep();
  };

  private _nextStep() {
    this.createListingService.previewListing(this.vendorId);
  };

  private _restoreFormValues(values: any) {
    if(values.businessDescription) {
      this.stepFiveForm.controls['businessDescription'].setValue(values.businessDescription);
    }
  };

};
