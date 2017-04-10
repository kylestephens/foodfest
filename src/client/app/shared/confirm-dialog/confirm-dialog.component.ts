import { Component, Input }               from '@angular/core';
import { ModalService }                   from '../../services/modal.service';
import { ConfirmDialogService }           from '../../services/confirm-dialog.service';
import { ConfirmDialog }                  from '../model/confirmDialog';
/**
 * This class represents confirm dialog component.
 */
@Component({
  moduleId: module.id,
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.component.html',
  styleUrls: ['confirm-dialog.component.css']
})

export class ConfirmDialogComponent {
  @Input()
  message: string;

  @Input()
  action: string;

  @Input()
  record: any;

  constructor( private modalService: ModalService, private confirmDialogService: ConfirmDialogService) {
  };

  cancel() {
    event.stopPropagation();
    this.modalService.hide();
  }

  deleteMessage() {
    let confirmDialog = new ConfirmDialog(this.message, this.action, this.record);
    this.confirmDialogService.confirmDialog(confirmDialog);
  }

}
