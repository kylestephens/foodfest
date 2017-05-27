import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation
}                                 from '@angular/core';
import { Subscription }           from 'rxjs/Subscription';

import { MessagingService }       from '../../services/messaging.service';
import { ModalService }           from '../../services/modal.service';
import { SettingsService }        from '../../services/settings.service';

import { CONSTANT }               from '../../core/constant';

/**
 * This class represents the modal pop-up component.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ModalComponent implements OnInit, OnDestroy {

  data: any;
  subscription: Subscription;
  subMessage: any;

  private body: HTMLElement = null;
  private modalContainer: HTMLElement = null;
  private modalTypes = CONSTANT.MODAL;
  private selectedModal = CONSTANT.MODAL.SIGN_UP;

  public modalActive: boolean = false;

  constructor(
    private modalService: ModalService,
    private messagingService: MessagingService,
    private settingsService: SettingsService
  ) {
    // subscribe to modal service messages
    this.subscription = this.modalService.getMessage().subscribe(subMessage => {
      console.debug('ModalComponent::subscription');
      this.subMessage = subMessage;
      if(subMessage.event && subMessage.event === CONSTANT.EVENT.MODAL.SHOW_MODAL) {
        this._onShowModalMessage(subMessage.modalType, subMessage.data);
      }
      if(subMessage.event && subMessage.event === CONSTANT.EVENT.MODAL.HIDE_MODAL) {
        this._hideModal();
      }
    });
  };

  ngOnInit() {
    // acquire reference to necessary DOM elements
    this.body = document.getElementsByTagName('body')[0];
    this.modalContainer = document.getElementById('modal-container');
  };

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  };

  public dismissModal = function () {
    this.modalService.hide();
  };

  public stopPropagation = function() {
    event.stopPropagation();
  }

  private _onShowModalMessage(modalType: any, data: any) {
    console.debug('ModalComponent::onShowModalMessage');
    this.selectedModal = modalType;
    this.data = data;
    this._setupModal(this.modalContainer);
    this._showModal();
  };

  private _showModal = function() {
    this.modalContainer.classList.remove('out');
    this.body.classList.add('modal-active');
    this.modalActive = true;
  };

  private _hideModal = function() {
    this.messagingService.hideByRef('contact-us');
    this.messagingService.hideByRef('modal');
    this.messagingService.hideByRef('signin');
    this.messagingService.hideByRef('signup');
    this._onHideModal(this.modalContainer);
  };

  private _setupModal (modal: HTMLElement) {
    var body = document.getElementsByTagName('body')[0],
      boundingBox = document.getElementById('bounding-box'),
      modal = <HTMLElement>document.getElementsByClassName('modal')[0],
      width = modal.offsetWidth,
      height = modal.offsetHeight < CONSTANT.MODAL.MIN_HEIGHT ? CONSTANT.MODAL.MIN_HEIGHT : modal.offsetHeight;

    if(this.settingsService.getDeviceType() === 'phone') {
      boundingBox.setAttribute('height', '80%');
      boundingBox.setAttribute('width', '100%');
      modal.setAttribute('height', '80%');
      modal.setAttribute('width', '100%');
    } else {
      boundingBox.setAttribute('height', height.toString());
      boundingBox.setAttribute('width', width.toString());
    }
  };

  private _onHideModal (modalContainer: HTMLElement) {
    var body = document.getElementsByTagName('body')[0];
    modalContainer.classList.add('out');
    window.setTimeout(function () {
      body.classList.remove('modal-active');
    }, 500);
  };
};
