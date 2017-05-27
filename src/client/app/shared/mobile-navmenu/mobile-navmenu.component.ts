import {
  Component,
  OnDestroy,
  OnInit
}                               from '@angular/core';
import { Subscription }         from 'rxjs/Subscription';

import { Notifications }         from '../model/notification';

import { AccountService }       from '../../services/account.service';
import { ModalService }         from '../../services/modal.service';
import { SettingsService }      from '../../services/settings.service';
import { BrowserService }       from '../../services/browser.service';
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

  private subscriptions: Subscription[] = [];
  private subMessage: any;

  private menuButton: HTMLElement = null;
  private menuContent: HTMLElement = null;

  public browser: any = this.browserService.get();
  public isPhone: boolean = this.browser.deviceType === 'phone';
  public isTablet: boolean = this.browser.deviceType === 'tablet';

  public loggedIn: boolean = false;
  public userType: number;
  public isVendor: boolean = false;
  public notifications: Notifications;
  public notificationsNum: number = 0;

  constructor(
    private accountService: AccountService,
    private modalService: ModalService,
    private settingsService: SettingsService,
    private browserService: BrowserService
  ) {
    if(this.isPhone || this.isTablet) {
      this.setUserDetails();
      if(this.isPhone) this.setUserNotifications();

      // subscribe to account service messages
      this.subscriptions.push(this.accountService.getMessage().subscribe(subMessage => {
        console.debug('MobileNavmenuComponent::subscription');
        if(this.accountService.isLoggedIn()) {
          if(subMessage.event === CONSTANT.EVENT.SESSION.LOGGED_IN) {
            this.setUserDetails();
            this.setUserNotifications();
          }
          else if(subMessage.event === CONSTANT.EVENT.SESSION.USER_TYPE) {
            this.setUserDetails();
          }
        }
      }));

      this.subscriptions.push(this.accountService.notificationsChange.subscribe((notifications: Notifications) => {
        this.setNotifications(notifications);
      }));
    }
  }

  private setUserDetails() {
    this.userType = this.accountService.getUser().user_type;
    this.isVendor = (this.accountService.getUser().user_type === CONSTANT.user.types.VENDOR.code) ? true : false;
    this.loggedIn = this.accountService.isLoggedIn();
  }

  private setUserNotifications() {
    this.accountService.getNotifications()
    .then((notifications) => {
      this.setNotifications(notifications);
    })
    .catch((reason: any) => {
      this.notifications = {};
      this.notificationsNum = 0;
    });
  }

  private setNotifications(notifications: Notifications) {
    this.notifications = notifications;
    this.notificationsNum = 0;
    for (let key in this.notifications) {
      this.notificationsNum += this.notifications[key];
    }
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

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
