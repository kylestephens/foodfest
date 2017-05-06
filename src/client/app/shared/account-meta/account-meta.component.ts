import { Component, OnDestroy }  from '@angular/core';
import { Subscription }          from 'rxjs/Subscription'

import { AccountService }        from '../../services/account.service';
import { ModalService }          from '../../services/modal.service';

import { CONSTANT }              from '../../core/constant';

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

  public firstname: string;
  public userType: number;
  public isVendor: boolean = false;
  public loggedIn: boolean = false;
  public adminDropdownActive: boolean = false;
  public firstClick: boolean = false;

  constructor(private accountService: AccountService, private modalService: ModalService) {
    this.setUserDetails();

    // subscribe to account service messages
    this.subscription = this.accountService.getMessage().subscribe(subMessage => {
      console.debug('AccountMetaComponent::subscription');
      if(subMessage.event === CONSTANT.EVENT.SESSION.LOGGED_IN || subMessage.event === CONSTANT.EVENT.SESSION.USER_TYPE) {
        if(this.accountService.isLoggedIn()) {
          this.setUserDetails();
        }
      }
    });
  }

  setUserDetails() {
    this.firstname = this.accountService.getUser().firstname;
    this.userType = this.accountService.getUser().user_type;
    this.isVendor = (this.accountService.getUser().user_type === CONSTANT.user.types.VENDOR.code) ? true : false;
    this.loggedIn = this.accountService.isLoggedIn();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
      document.getElementsByTagName('body')[0].addEventListener('click', this._bodyClick.bind(this));
    } else {
      this.adminDropdownActive = false;
      adminDropdown.classList.remove('admin-dropdown--active');
      document.getElementsByTagName('body')[0].removeEventListener('click', this._bodyClick);
    }
  };

  public logout = function() {
    console.debug('AccountMetaComponent::logout');
    this.accountService.reset();
    window.location.pathname = '/';
  }

  private _bodyClick = function(event: any) {
    if(!event.target.classList.contains('js-admin-link')) {
      var adminDropdown = document.getElementsByClassName('admin-dropdown')[0];
      adminDropdown.classList.remove('admin-dropdown--active');
      this.adminDropdownActive = false;
      document.getElementsByTagName('body')[0].removeEventListener('click', this._bodyClick);
    } else {
      this.firstClick = false;
    }
  };

}
