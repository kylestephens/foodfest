import { Injectable }        from '@angular/core';
import { Observable }        from 'rxjs';
import { Subject }           from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import { RestService }       from './rest.service';
import { Http, Response }    from '@angular/http';

import {
  LocalStorageService,
  SessionStorageService
}                            from 'ng2-webstorage';
import { SettingsService }   from './settings.service';
import { User }              from '../shared/model/user';
import { Vendor }            from '../shared/model/vendor';
import { CONSTANT }          from '../core/constant';

@Injectable()
export class AccountService {

  private subject = new Subject<any>();
  private user: User = new User();
  private vendor: Vendor = new Vendor();
  private favourites: Array<any> = [];
  private loggedIn = false;
  redirectUrl: string = '';

  constructor(
    private restService: RestService,
    private settingsService: SettingsService,
    private localStorageService: LocalStorageService
  ) {};

  createAccount = function() {
    return this.restService.post(
      this.settingsService.getServerBaseUrl() + '/users/register', {
        email: this.user.email,
        password: this.user.password,
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        facebook_user_id: this.user.facebook_user_id,
        google_user_id: this.user.google_user_id,
        user_type: CONSTANT.user.types.USER.code
      }
    ).then(
      (response: any) => {
        response = response.json();
        this.user.id = response.id;
        this.user.akAccessToken = response.token;
        this.user.user_type = response.user_type;
        this.setLoggedIn(true);
      },
      (reason: any) => {
        this.setLoggedIn(false);
        return Promise.reject(reason);
      }
    );
  };

  login = function() {
    return this.restService.post(
      this.settingsService.getServerBaseUrl() + '/users/login', {
        email: this.user.email,
        password: this.user.password,
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        facebook_user_id: this.user.facebook_user_id,
        google_user_id: this.user.google_user_id
      }
    ).then(
      (response: any) => {
        response = response.json();
        this.user.id = response.id;
        this.user.name = response.firstname;
        this.user.akAccessToken = response.token;
        this.user.user_type = response.user_type;
        this.setLoggedIn(true);
      },
      (reason: any) => {
        this.setLoggedIn(false);
        return Promise.reject(reason);
      }
    );
  };

  userIsActiveVendor(): Promise<boolean> {
    return this.restService.get(
      this.settingsService.getServerBaseUrl() + '/users/active', null, this.getUser().akAccessToken,
    ).then((response: Response) => {
      return response.json();
    });
  }

  isLoggedIn = function () {
    return this.loggedIn;
  };

  getUser = function() {
    return this.user;
  };

  /**
   * Retrieve favourites belonging to a user
   * Must be already logged in before calling
   */
  getFavourites = function() {
    return new Promise((resolve, reject) => {

      let localStorageFavs = this.localStorageService.retrieve(
        CONSTANT.LOCALSTORAGE.FAVOURITES
      );

      if(localStorageFavs && localStorageFavs.length > 0) {
        this.favourites = localStorageFavs;
        resolve(localStorageFavs);
      } else {
        this.restService.get(
          this.settingsService.getServerBaseUrl() + '/users/favourites',
          null, this.getUser().akAccessToken
        ).then((response: any) => {
          this.favourites = response.json();
          this.localStorageService.store(
            CONSTANT.LOCALSTORAGE.FAVOURITES,
            this.favourites
          );
          resolve(this.favourites);
        }).catch((reason: any) => {
          this.favourites = [];
          this.localStorageService.clear(
            CONSTANT.LOCALSTORAGE.FAVOURITES
          );
          reject(reason);
        });
      }

    });
  };

  /**
   * Add a given favourite to the list of users favourites
   *
   * @param {number} vendorId
   */
  addFavourite = function(vendorId: number) {
    this.favourites.push(vendorId);
    this.localStorageService.store(
      CONSTANT.LOCALSTORAGE.FAVOURITES,
      this.favourites
    );
  };

  /**
   * Remove a given favourite from the list of users favourites
   *
   * @param {number} vendorId
   */
  removeFavourite = function(vendorId: number) {
    let index = this.favourites.indexOf(vendorId);
    if(index > -1) {
      this.favourites.splice(index, 1);
      this.localStorageService.store(
        CONSTANT.LOCALSTORAGE.FAVOURITES,
        this.favourites
      );
    }
  };

  /**
   * Update user logged in status
   *
   * If logged in, store details in storage for return visits
   * If logged out, clear details from storage
   *
   * @param {boolean} newSessionStatus - if set to true, user is deemed logged in
   */
  setLoggedIn = function (newSessionStatus: boolean) {
    console.debug('AccountService::setLoggedIn: ' + newSessionStatus);
    if(this.loggedIn !== newSessionStatus) {
      this.loggedIn = newSessionStatus;
      this.subject.next({
        event: CONSTANT.EVENT.SESSION.LOGGED_IN
      });
    }

    if(this.loggedIn) {
      this.localStorageService.store(
        CONSTANT.LOCALSTORAGE.SESSION,
        this.toJson()
      );
      this.localStorageService.store(
        CONSTANT.LOCALSTORAGE.TOKEN,
        this.user.akAccessToken
      );
    } else {
      this.localStorageService.clear(
        CONSTANT.LOCALSTORAGE.SESSION,
        CONSTANT.LOCALSTORAGE.TOKEN
      );
    }
  };

  setName = function (fullName: string) {
    this.user.name = fullName;
    this.user.firstname = this.user.name.split(' ')[0];
    this.user.lastname = this.user.name.split(' ').slice(-1).pop();
  };

  setFacebookDetails = function(response: any) {
    this.user.facebook_user_id = response.id;
    this.setName(response.name);
    this.user.email = response.email;
    this.user.facebookLogin = true;
  };

  setGoogleDetails = function(response: any) {
    this.user.google_user_id = response.id;
    this.setName(response.name);
    this.user.email = response.email;
    this.user.googleLogin = true;
  };

  setEmailDetails = function(data: any) {
    if(data.fullName) this.user.setName(data.fullName);
    this.user.password = data.password;
    this.user.email = data.email;
  };

  setVendor = function(vendor: any) {
    this.vendor = vendor;
  };

  getVendor = function() {
    return this.vendor;
  };

  getVendorId = function() {
    return this.vendor.id;
  };

  setVendorId = function(id: number) {
    this.vendor.id = id;
  };

  reloadSession = function(sessionDetails: any, sessionToken: any) {
    this.loggedIn = sessionDetails['loggedIn'];
    this.user = sessionDetails['user'];
    this.vendor = sessionDetails['vendor'];
  };

  reset = function() {
    this.setLoggedIn(false);
    this.user = new User();
    this.vendor = new Vendor();
  };

  toJson = function() {
    var json: any = {};
    json['loggedIn'] = this.loggedIn;
    json['user'] = this.user;
    json['vendor'] = this.vendor;
    return json;
  };

  updateLocalStorage(userType: number) {
    this.localStorageService.store(
      CONSTANT.LOCALSTORAGE.SESSION,
      this.toJson()
    );
  };

  clearLocalStorage(userType: number) {
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.SESSION
    );
  };

  updateUserType(userType: number) {
    this.user.user_type = userType;
    let localStorageSession = this.localStorageService.retrieve(CONSTANT.LOCALSTORAGE.SESSION);
    localStorageSession.user_type = this.user.user_type;
    this.localStorageService.store(
      CONSTANT.LOCALSTORAGE.SESSION,
      localStorageSession
    );

    this.subject.next({
      event: CONSTANT.EVENT.SESSION.USER_TYPE
    });
  };

  /**
  * Send message as observable
  */
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  };

};
