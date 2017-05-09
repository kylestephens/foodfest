import {
  Component,
  Input,
  ViewEncapsulation
}                                        from '@angular/core';
import { Vendor }                        from '../../../../shared/model/vendor';

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

export class ListingsImagesComponent {

  @Input()
  vendor: Vendor;

}
