import { Injectable, EventEmitter } from '@angular/core';
import { BrowserService }           from './browser.service';
import { RestService }              from './rest.service';
import { WindowRefService }         from './window-ref.service';
import { CONSTANT }                 from '../core/constant';
import { Style }                    from '../shared/model/style';
import { DietRequirement }          from '../shared/model/dietRequirement';
import { BusinessType }             from '../shared/model/businessType';
import { BusinessSetup }            from '../shared/model/businessSetup';

import {
  LocalStorageService,
  SessionStorageService
} from 'ng2-webstorage';

@Injectable()
export class SettingsService {

  /**
  * Event emitted when settings are retrived. Needed in case we access settings before the call is finished.
  */
  public settingsRetrived: EventEmitter<any> = new EventEmitter();

  /**
   * Site configured parameters
   * These are constants, contained in index.html
   */
  private siteParams = this.winRef.nativeWindow.AK.SiteParams;

  /**
   * Site settings & category options
   * Defined in a number of DB Tables
   */
  private settings: any;

  /**
   * Device, screen and browser details
   */
  private browser = this.browserService.get();

  /**
   * Geographic locations available for the app
   *
   * regions: [counties]
   * counties: [places]
   */
  private locations: any;

  constructor(
    private browserService: BrowserService,
    private localStorageService: LocalStorageService,
    private restService: RestService,
    private winRef: WindowRefService,
   ) {};

  /**
   * Call after app launch to discover device details
   */
  public syncBrowserDetails(): void {
    this.browser = this.browserService.get();
  };

  /**
   * Call after app launch to load site settings, categories, classifications, etc.
   */
  public syncSiteSettings(): void {
    // Check local storage for login details - keep signed in
    if(this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.SETTINGS)) {
      this.settings = this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.SETTINGS);
      this.settingsRetrived.emit();
    } else {
      this.restService.get(this.getServerBaseUrl() + '/settings/' + this.getSiteId())
        .then((settings: any) => {
          let _settings = settings.json();
          this.settings = _settings;
          this.localStorageService.store(
            CONSTANT.LOCALSTORAGE.SETTINGS,
            this.settings
          );
          this.settingsRetrived.emit();
        })
        .catch((err: any) => {
          console.dir(err);
        });
    }
  };

  /**
   * Returns base url for the location of the front-end app
   */
  public getBaseUrl(): any {
    var pathArray = location.href.split( '/' ),
      protocol = pathArray[0],
      host = pathArray[2];

    return protocol + '//' + host;
  };

  /**
   * Returns base url for the back-end of app
   */
  public getServerBaseUrl(): string {
    return this.siteParams.serverBaseUrl;
  };

  /**
   * Returns browser details
   * (syncBrowserDetails must have been called first)
   */
  public getBrowserDetails(): any {
    return this.browser;
  };

  /**
   * Returns device type - desktop, tablet, phone, etc.
   */
  public getDeviceType(): string {
    return this.browser.deviceType;
  };

  /**
   * Returns site id
   */
  public getSiteId(): string {
    return this.siteParams.siteId;
  };

  /**
   * Returns are settings available
   */
  public getIsSettingsCallDone(): boolean {
    if(this.settings) return true;
    else return false;
  }

  /**
   * Returns business setups available
   */
  public getBusinessSetups(): Array<BusinessSetup> {
    return this.settings.businessSetups;
  };

  /**
   * Returns business types available
   */
  public getBusinessTypes(): Array<BusinessType> {
    return this.settings.businessTypes;
  };

  /**
   * Returns diet requirements available
   */
  public getDietRequirements(): Array<DietRequirement> {
    return this.settings.dietRequirements;
  };

  /**
   * Returns event types available
   */
  public getEventTypes(): Array<Object> {
    return this.settings.eventTypes;
  };

  /**
   * Returns site meta
   */
  public getSiteMeta(): Array<Object> {
    return this.settings.siteMeta;
  };

  /**
   * Returns food styles available
   */
  public getStyles(): Array<Style> {
    return this.settings.styles;

  };

};
