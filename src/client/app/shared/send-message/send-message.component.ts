import { Component, Input, OnInit }       from '@angular/core';
import { Subscription }                   from 'rxjs/Subscription';
import { ModalService }                   from '../../services/modal.service';
import { ConfirmDialogService }           from '../../services/confirm-dialog.service';
import { ConfirmDialog }                  from '../model/confirmDialog';
import { CONSTANT }                       from '../../core/constant';
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
  private subscription: Subscription;

  constructor( private modalService: ModalService, private confirmDialogService: ConfirmDialogService) {
    this.subscription = this.modalService.getMessage().subscribe(subMessage => {
      if(subMessage.event && subMessage.event === CONSTANT.EVENT.MODAL.HIDE_MODAL) {
        this._onHideModal();
      }

      if(subMessage.event && subMessage.event === CONSTANT.EVENT.MODAL.SHOW_MODAL) {
        this._onShowModal(subMessage.data.record);
      }
    });
  };

  ngOnInit() {
    this._setModalVariables();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  };

  cancel() {
    event.stopPropagation();
    this.modalService.hide();
  }

  sendMessage() {
    if(!this.message.trim()) return;
    if(this.multipleVendors) {
      let selectedVendor = this.record.vendors.filter((vendor:any) => {
        return vendor.id === +this.selectedVendorId;
      })[0];
      this.record.selectedVendor = selectedVendor;
    }
    else {
      this.record.selectedVendor = this.record.vendors[0];
    }

    let confirmDialog = new ConfirmDialog(this.message, this.action, this.record);
    this.confirmDialogService.confirmDialog(confirmDialog);
  }

    private _onHideModal() {
    this.record = null;
    this.message = null;
    this.multipleVendors = false;
    this.selectedVendorId = null;
  }

  private _onShowModal(record: any) {
    this.record = record;
    this._setModalVariables();
  }

  private _setModalVariables() {
   if(this.record.vendors.length > 1) {
      this.multipleVendors = true;
      this.selectedVendorId = this.record.vendors[0].id;
    }
  }

}
