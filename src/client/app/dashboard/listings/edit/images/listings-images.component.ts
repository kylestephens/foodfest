import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation
}                                        from '@angular/core';

import { Vendor }                        from '../../../../shared/model/vendor';
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
    private settingsService: SettingsService
  ) {};

  ngOnInit() {
    debugger;
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

}
