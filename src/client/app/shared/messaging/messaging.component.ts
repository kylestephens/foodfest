import {
  Component,
  OnDestroy,
  Input
}                           from '@angular/core';
import { Subscription }     from 'rxjs/Subscription';

import { MessagingService } from '../../services/messaging.service';

import { CONSTANT }         from '../../core/constant';

/**
 * This class represents the messaging component
 *
 * This is used to present error and warning messages
 * to the user, as well as warnings and informational messages
 */
@Component({
  moduleId: module.id,
  selector: 'ak-messaging',
  templateUrl: 'messaging.component.html',
  styleUrls: ['messaging.component.css']
})

export class MessagingComponent {
  @Input() ref: string;

  private messageDuration: number;
  private subscription: Subscription;
  private subMessage: any;

  public messageTypes: any = CONSTANT.MESSAGING;
  public showMessage: boolean = false;
  public selectedType: string = '';
  public messageText: string = '';
  public temporary: boolean = false;

  constructor(
    private messagingService: MessagingService
  ) {
    var me = this;
    // subscribe to messaging service messages
    this.subscription = this.messagingService.getMessage().subscribe(subMessage => {
      console.debug('MessagingComponent::subscription');
      this.subMessage = subMessage;
      if(subMessage === CONSTANT.EVENT.MESSAGING.HIDE_ALL_MESSAGES) {
        me.showMessage = false;
      }
      else if(subMessage.event && subMessage.event === CONSTANT.EVENT.MESSAGING.HIDE_MESSAGE_BY_REF) {
        if(subMessage.messageRef === me.ref) {
          me.showMessage = false;
        }
      }
      else if(subMessage.event && subMessage.event === CONSTANT.EVENT.MESSAGING.SHOW_MESSAGE) {
        if(subMessage.messageRef === me.ref) {
          me.showMessage = true;
          me.selectedType = subMessage.messageType;
          me.messageText = subMessage.messageText;
          me.temporary = subMessage.temporary;
          me.messageDuration = subMessage.duration;
          if(me.temporary) {
            setTimeout(() => {
              me.showMessage = false
            }, me.messageDuration);
          }
        }
      }
    });
  };

  ngOnDestroy() {
    this.subscription.unsubscribe();
  };

}
