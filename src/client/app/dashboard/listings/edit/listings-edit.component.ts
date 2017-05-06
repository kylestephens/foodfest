import {
  Component,
  Input,
  ViewEncapsulation
}                                        from '@angular/core';
import { Vendor }                        from '../../../shared/model/vendor';

/**
 * This class represents the lazy loaded listing edits component
 */
@Component({
  moduleId: module.id,
  selector: 'ak-listings-edit',
  templateUrl: 'listings-edit.component.html',
  styleUrls: ['listings-edit.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ListingsEditComponent {

  @Input()
  vendor: Vendor;

}
