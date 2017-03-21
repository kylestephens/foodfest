import { Component }        from '@angular/core';
import { Subscription }     from 'rxjs/Subscription'

import { AccountService }   from '../../services/account.service';
import { ModalService }     from '../../services/modal.service';

import { CONSTANT }         from '../../core/constant';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'account-meta',
  templateUrl: 'account-meta.component.html',
  styleUrls: ['account-meta.component.css']
})

export class AccountMetaComponent {

  private subscription: Subscription;
  private subMessage: any;

  public firstName: string = this.accountService.getFirstName();;
  public avatar: string = '';
  public loggedIn: boolean = false;
  public adminDropdownActive: boolean = false;
  public firstClick: boolean = false;

  constructor(
    private accountService: AccountService,
    private modalService: ModalService
  ) {
    var me = this;
    this.loggedIn = this.accountService.isLoggedIn();

    // subscribe to messaging service messages
    this.subscription = this.accountService.getMessage().subscribe(subMessage => {
      console.debug('AccountMetaComponent::subscription');
      if(subMessage.event === CONSTANT.EVENT.SESSION.LOGGED_IN) {
        me.loggedIn = subMessage.sessionStatus;
        if(me.loggedIn) {
          me.firstName = me.accountService.getFirstName();
          me.avatar = me.accountService.getProfilePictureUrl();
        }
      }
    });
  };

  public showSignUp = function() {
    console.debug('AccountMetaComponent::showSignUp');
    this.modalService.show(CONSTANT.MODAL.SIGN_UP);
  };

  public showSignIn = function() {
    console.debug('AccountMetaComponent::showSignIn');
    this.modalService.show(CONSTANT.MODAL.SIGN_IN);
  };

  public toggleDropdown = function() {
    console.debug('AccountMetaComponent::toggleDropdown');
    var adminDropdown = document.getElementsByClassName('admin-dropdown')[0];
    if(!this.adminDropdownActive) {
      this.adminDropdownActive = true;
      adminDropdown.classList.add('admin-dropdown--active');
      document.getElementsByTagName('body')[0].addEventListener('click', this.bodyClick);
    } else {
      this.adminDropdownActive = false;
      adminDropdown.classList.remove('admin-dropdown--active');
      document.getElementsByTagName('body')[0].removeEventListener('click', this.bodyClick);
    }
  };

  public logout = function() {
    console.debug('AccountMetaComponent::logout');
    this.accountService.reset();
    window.location.pathname = '/';
  }

  private bodyClick = function(event) {
    if(!event.target.classList.contains('js-admin-link')) {
      var adminDropdown = document.getElementsByClassName('admin-dropdown')[0];
      adminDropdown.classList.remove('admin-dropdown--active');
      this.adminDropdownActive = false;
      document.getElementsByTagName('body')[0].removeEventListener('click', $scope.bodyClick);
    } else {
      this.firstClick = false;
    }
  };

}
