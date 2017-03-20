import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { CONSTANT } from '../core/constant';

@Injectable()
export class ModalService {

  private subject = new Subject<any>();

  show(modalType: string, data?: any) {
    console.debug('ModalService::show');
    this.subject.next({
      event: CONSTANT.EVENT.MODAL.SHOW_MODAL,
      modalType,
      data
    });
  };

  hide() {
    console.debug('ModalService::show');
    this.subject.next({
      event: CONSTANT.EVENT.MODAL.HIDE_MODAL
    });
  };

  /**
  * Send message as observable
  */
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  };

};
