import { Component }         from '@angular/core';

import { ModalService }      from '../services/modal.service';

import { CONSTANT }          from '../core/constant';

/**
 * This class represents the lazy loaded CommercialComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-catering-jobs',
  templateUrl: 'cateringJobs.component.html',
  styleUrls: ['cateringJobs.component.css']
})
export class CateringJobsComponent {

  constructor(
    private modalService: ModalService
  ) {};

  public onClickContactUs() {
    this.modalService.show(CONSTANT.MODAL.CONTACT;)
  };

}
