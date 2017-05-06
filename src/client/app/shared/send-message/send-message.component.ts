import { Component, Input, OnInit }       from '@angular/core';
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

export class SendMessageComponent implements OnInit{
  @Input()
  record: any;

  @Input()
  action: string;

  message: string;
  multipleVendors: boolean = false;
  selectedVendorId: number;

  constructor( private modalService: ModalService, private confirmDialogService: ConfirmDialogService) {
  };

  ngOnInit() {
    if(this.record.vendors.length > 1) {
      this.multipleVendors = true;
      this.selectedVendorId = this.record.vendors[0].id;
    }
  }

  cancel() {
    event.stopPropagation();
    this.modalService.hide();
  }

  sendMessage() {
    if(!this.message.trim()) return;

    if(this.multipleVendors) {
      let selectedVendor = this.record.vendors.filter((vendor:any) => {
        return vendor.id === this.selectedVendorId;
      })[0];
      this.record.selectedVendor = selectedVendor;
    }
    else {
      this.record.selectedVendor = this.record.vendors[0];
    }

    let confirmDialog = new ConfirmDialog(this.message, this.action, this.record);
    this.confirmDialogService.confirmDialog(confirmDialog);
  }

}
