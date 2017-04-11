import {
  Component,
  OnDestroy,
  OnInit
}                               from '@angular/core';
import { Subscription }         from 'rxjs/Subscription';

import { AccountService }       from '../../services/account.service';
import { ModalService }         from '../../services/modal.service';
import { SettingsService }      from '../../services/settings.service';
import { CONSTANT }             from '../../core/constant';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'mobile-navmenu',
  templateUrl: 'mobile-navmenu.component.html',
  styleUrls: ['mobile-navmenu.component.css'],
})

export class MobileNavmenuComponent implements OnInit {

  private subscription: Subscription;
  private subMessage: any;

  private menuButton: HTMLElement = null;
  private menuContent: HTMLElement = null;

  public loggedIn: boolean = false;
  public userType: number;
  public isVendor: boolean = false;

  constructor(
    private accountService: AccountService,
    private modalService: ModalService,
    private settingsService: SettingsService
  ) {
    this.setUserDetails();

    // subscribe to account service messages
    this.subscription = this.accountService.getMessage().subscribe(subMessage => {
      console.debug('MobileNavmenuComponent::subscription');
      if(subMessage.event === CONSTANT.EVENT.SESSION.LOGGED_IN || subMessage.event === CONSTANT.EVENT.SESSION.USER_TYPE) {
        if(this.accountService.isLoggedIn()) {
          this.setUserDetails();
        }
      }
    });
  };

  setUserDetails() {
    this.userType = this.accountService.getUser().user_type;
    this.isVendor = (this.accountService.getUser().user_type === CONSTANT.user.types.VENDOR.code) ? true : false;
    this.loggedIn = this.accountService.isLoggedIn();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  };

  /**
   * Resize the menu to fit screen OnInit
   */
  ngOnInit() {
    this.loggedIn = this.accountService.isLoggedIn();
    this.menuButton = document.getElementById('menu-button');
    this.menuContent = document.getElementById('menu-content');
    this._resizeMenu();
    window.onresize = () => { this._resizeMenu(); };
  }

  public toggleMenu = function() {
    this.menuButton.classList.toggle('menu-open');
    this.menuContent.classList.toggle('active');
  };

  private _resizeMenu() {
    this.settingsService.syncBrowserDetails();
    var screen = this.settingsService.getBrowserDetails().screen;

    this.menuContent.style.width = screen.width + 'px';
    this.menuContent.style.height = screen.height + 'px';
    this.menuContent.style.marginLeft = '-' + screen.width + 'px';
  };

  public logout = function() {
    console.debug('AccountMetaComponent::logout');
    this.accountService.reset();
    window.location.pathname = '/';
  }

};
