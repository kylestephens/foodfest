import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject }    from 'rxjs/Subject';
import { CONSTANT }   from '../core/constant';

@Injectable()
export class LoaderService {

  private subject = new Subject<any>();

  show(modalType: string, data?: any) {
    console.debug('LoaderService::show');
    this.subject.next({
      event: CONSTANT.EVENT.LOADER.SHOW_LOADER,
      modalType,
      data
    });
  };

  hide() {
    console.debug('LoaderService::hide');
    this.subject.next({
      event: CONSTANT.EVENT.LOADER.HIDE_LOADER
    });
  };

  /**
   * Send message as observable
   */
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  };

};
