import { Component, Input }       from '@angular/core';
import {
  LocalStorageService,
  SessionStorageService
}                                 from 'ng2-webstorage';

import { SettingsService }        from '../../services/settings.service';
import { CONSTANT }               from '../../core/constant';

/**
 * This class represents confirm dialog component.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-cookies-notification',
  templateUrl: 'cookies-notification.component.html',
  styleUrls: ['cookies-notification.component.css']
})

export class CookiesNotificationComponent {

  @Input()
  display: boolean;

  constructor(private localStorageService: LocalStorageService) {};

  public acceptCookies = function() {
    this.localStorageService.store(CONSTANT.LOCALSTORAGE.COOKIES, true);
    this.display = false;
  }

}
