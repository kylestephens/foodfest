import { Injectable }       from '@angular/core';
import { BrowserService }   from './browser.service';
import { WindowRefService } from './window-ref.service';

@Injectable()
export class SettingsService {

  /**
   * Site configured settings
   * These are constants, contained in index.html
   */
  private settings = this.winRef.nativeWindow.AK.Settings;

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

  /**
   * All site categories
   */
  private categories: any[];

  /**
   * Featured site categories
   */
  private featuredCategories: any[];

  constructor(
    private winRef: WindowRefService,
    private browserService: BrowserService
   ) {
    // getting the native window obj
    console.log('Native window obj', winRef.nativeWindow);
  }

  public syncBrowserDetails(): void {
    this.browser = this.browserService.get();
  };

  public setSiteSettings(settings: any): void {
    this.categories = settings.categories;
    this.featuredCategories = settings.categories_front_page;
  };

  public setSiteLocations(siteLocations: any): void {
    this.locations = siteLocations;
  };

  public getCategories(): any {
    return this.categories;
  };

  public getFeaturedCategories(): any {
    return this.featuredCategories;
  };

  public getBaseUrl(): any {
    var pathArray = location.href.split( '/' ),
      protocol = pathArray[0],
      host = pathArray[2];

    return protocol + '//' + host;
  };

  public getServerBaseUrl(): string {
    return this.settings.serverBaseUrl;
  };

  public getBrowserDetails(): any {
    return this.browser;
  };

  public getDeviceType(): string {
    return this.browser.deviceType;
  };

  public getSiteId(): string {
    return this.settings.siteId;
  };

  public getClientName(): string {
    return this.settings.clientName;
  };

  public getClientLanguage(): string {
    return this.settings.language;
  };

  public getClientCurrency(): string {
    return this.settings.currency;
  };

  public getClientCountryCode(): string {
    return this.settings.countryCode;
  };

};
