import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { CONSTANT } from '../core/constant';

@Injectable()
export class CreateListingService {

  private subject = new Subject<any>();

  nextStep() {
    console.debug('CreateListingService::nextStep');
    this.subject.next({
      event: CONSTANT.EVENT.CREATE_LISTING.NEXT_STEP
    });
  };

  previousStep() {
    console.debug('CreateListingService::previousStep');
    this.subject.next({
      event: CONSTANT.EVENT.CREATE_LISTING.PREVIOUS_STEP
    });
  };

  /**
  * Send message as observable
  */
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  };

};
