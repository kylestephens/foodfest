import { Injectable }  from '@angular/core';
import { Observable }  from 'rxjs';
import { Subject }     from 'rxjs/Subject';
import { CONSTANT }    from '../core/constant';

@Injectable()
export class MessagingService {

  private subject = new Subject<any>();

  /**
   * Show a message to the user
   * @param {string} messageRef - ref for the specific message block
   * @param {string} messageType - success, error, warning, info
   * @param {string} messageText - the text to show in the message block
   * @param {boolean} temporary - if set to true, the message will display for interval
   * @param {integer} duration - duration in milliseconds of temporary message
   */
  show(messageRef: string, messageType?: string, messageText?: string, temporary?: boolean, duration?: number) {
    console.debug('MessagingService::show');
    this.subject.next({
      event: CONSTANT.EVENT.MESSAGING.SHOW_MESSAGE,
      messageRef,
      messageType,
      messageText,
      temporary,
      duration: duration || CONSTANT.MESSAGING.DEFAULT_DURATION
    });
  };

  /**
   * Hide all instances of messages across the site
   */
  hideAll(): void {
    console.debug('MessagingService::hideAll');
    this.subject.next(
      CONSTANT.EVENT.MESSAGING.HIDE_ALL_MESSAGES
    );
  };

  /**
   * Hide a specific instance of a message
   * @param {string} messageRef - ref for the specific message block
   */
  hideByRef(messageRef: string): void {
    console.debug('MessagingService::hideByRef');
    this.subject.next({
      event: CONSTANT.EVENT.MESSAGING.HIDE_MESSAGE_BY_REF,
      messageRef
    });
  };

  /**
  * Send message as observable
  */
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  };

};
