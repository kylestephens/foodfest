import { Component }         from '@angular/core';

import { ModalService }      from '../services/modal.service';

import { CONSTANT }          from '../core/constant';

/**
 * This class represents the lazy loaded CommercialComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-commercial',
  templateUrl: 'commercial.component.html',
  styleUrls: ['commercial.component.css']
})
export class CommercialComponent {

  constructor(
    private modalService: ModalService
  ) {};

  public onClickContactUs() {
    this.modalService.show(CONSTANT.MODAL.CONTACT);
  };

}
