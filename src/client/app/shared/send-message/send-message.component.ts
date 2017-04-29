import { Component, Input }               from '@angular/core';
import { ModalService }                   from '../../services/modal.service';
import { ConfirmDialogService }           from '../../services/confirm-dialog.service';
import { ConfirmDialog }                  from '../model/confirmDialog';
/**
 * This class represents confirm dialog component.
 */
@Component({
  moduleId: module.id,
  selector: 'send-message',
  templateUrl: 'send-message.component.html',
  styleUrls: ['send-message.component.css']
})

export class SendMessageComponent {
  @Input()
  record: any;

  @Input()
  action: string;

  message: string;

  constructor( private modalService: ModalService, private confirmDialogService: ConfirmDialogService) {
  };

  cancel() {
    event.stopPropagation();
    this.modalService.hide();
  }

  sendMessage() {
    let confirmDialog = new ConfirmDialog(this.message, this.action, this.record);
    this.confirmDialogService.confirmDialog(confirmDialog);
  }

}
