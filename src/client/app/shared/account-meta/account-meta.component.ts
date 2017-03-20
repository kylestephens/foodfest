import { Component } from '@angular/core';

import { ModalService } from '../../services/modal.service';

import { CONSTANT } from '../../core/constant';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'account-meta',
  templateUrl: 'account-meta.component.html',
  styleUrls: ['account-meta.component.css']
})

export class AccountMetaComponent {

  constructor(private modalService: ModalService) {}

  showSignUp(): void {
    console.debug('AccountMetaComponent::showSignUp');
    this.modalService.show(CONSTANT.MODAL.SIGN_UP);
  };

  showSignIn(): void {
    console.debug('AccountMetaComponent::showSignIn');
    this.modalService.show(CONSTANT.MODAL.SIGN_IN);
  };

}
