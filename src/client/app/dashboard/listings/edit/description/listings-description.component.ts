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
  selector: 'ak-listings-description',
  templateUrl: 'listings-description.component.html',
  styleUrls: ['listings-description.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ListingsDescriptionComponent {

  @Input()
  vendor: Vendor;

  public activeItem: number = 1;

}
