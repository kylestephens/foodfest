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
  selector: 'ak-listings-menu',
  templateUrl: 'listings-menu.component.html',
  styleUrls: ['listings-menu.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ListingsMenuComponent {

  @Input()
  vendor: Vendor;

  public activeItem: number = 1;

}
