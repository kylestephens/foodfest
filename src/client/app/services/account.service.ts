import { Injectable }        from '@angular/core';
import { Observable }        from 'rxjs';
import { Subject }           from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import { RestService }       from './rest.service';
import { Http, Response }    from '@angular/http';

import {
  LocalStorageService
}                            from 'ng2-webstorage';
import { SettingsService }   from './settings.service';
import { User }              from '../shared/model/user';
import { Vendor }            from '../shared/model/vendor';
import { CONSTANT }          from '../core/constant';

@Injectable()
export class AccountService {

  private subject = new Subject<any>();
  private user: User = new User();
  private vendors: Array<Vendor> = [];
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
        this._setUserDetails(response);
        return response;
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
        this._setUserDetails(response);
      },
      (reason: any) => {
        this.setLoggedIn(false);
        return Promise.reject(reason);
      }
    );
  };

  _setUserDetails(data: any) {
    this.user.id = data.id;
    this.user.email = data.email;
    this.user.firstname = data.firstname;
    this.user.lastname = data.lastname;
    this.user.akAccessToken = data.token;
    this.user.user_type = data.user_type;
    this.user.date_joined = data.date_joined;
    this.setLoggedIn(true);
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
   *
   * If exist in session -> return those
   * Otherwise, lookup
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
      this.clearLocalStorage();
    }
  };

  /**
   * Strip first and last name from a full name
   *
   * @param {string} fullName - received from facebook/google login response
   */
  setName = function (fullName: string) {
    this.user.name = fullName;
    this.user.firstname = this.user.name.split(' ')[0];
    this.user.lastname = this.user.name.split(' ').slice(-1).pop();
  };

  /**
   * Set account details after login through Facebook
   *
   * @param {object} response - facebook login response
   */
  setFacebookDetails = function(response: any) {
    this.user.facebook_user_id = response.id;
    this.setName(response.name);
    this.user.email = response.email;
    this.user.facebookLogin = true;
  };

  /**
   * Set account details after login through Google
   *
   * @param {object} response - google login response
   */
  setGoogleDetails = function(response: any) {
    this.user.google_user_id = response.id;
    this.setName(response.name);
    this.user.email = response.email;
    this.user.googleLogin = true;
  };

  /**
   * Set account details after login through Email
   *
   * @param {object} response - email form details
   */
  setEmailDetails = function(data: any) {
    if(data.fullName) this.setName(data.fullName);
    this.user.password = data.password;
    this.user.email = data.email;
  };

  forgotPassword(params: any) {
    return this.restService.post(
      this.settingsService.getServerBaseUrl() + '/password/forgot', params
    ).then((response: Response) => {
      return response.json();
    }).catch(
    (reason:any) => {
      return Promise.reject(reason);
    });
  }

  resetPassword(params: any) {
    return this.restService.post(
      this.settingsService.getServerBaseUrl() + '/password/reset', params
    ).then(
      (response: any) => {
        response = response.json();
        this._setUserDetails(response);
      },
      (reason: any) => {
        this.setLoggedIn(false);
        return Promise.reject(reason);
      }
    );
  }

  /**
   * Add a new linked vendor
   *
   * @param {Vendor} vendor
   */
  addVendor = function(vendor: any) {
    this.vendors.push(vendor);
  };

  /**
   * Update a linked vendor
   *
   * @param {Vendor} vendor
   */
  updateVendor = function(vendor: any) {
    for(let i = 0; i < this.vendors.length; i++) {
      if(this.vendors[i].id === vendor.id) {
        this.vendors[i] = vendor;
      }
    }
  };

  /**
   * Returns all linked, published vendors
   */
  getUserVendors(): Promise<Array<Vendor>> {
    return this.restService.get(
      this.settingsService.getServerBaseUrl() + '/users/activevendors', null, this.getUser().akAccessToken,
    ).then((response: Response) => {
      return response.json() as Vendor[];
    });
  };

  /**
   * Returns all linked vendor, published or unpublished
   *
   * If exist in session -> return those
   * Otherwise, lookup
   */
  getVendors = function() {
    return new Promise((resolve, reject) => {
      if(this.vendors && this.vendors.length > 0) {
        resolve(this.vendors);
      } else {
        this.restService.get(
          this.settingsService.getServerBaseUrl() + '/users/vendors',
          null, this.getUser().akAccessToken
        ).then((response: any) => {
          this.vendors = response.json();
          resolve(this.vendors);
        }).catch((reason: any) => {
          this.vendors = [];
          reject(reason);
        });
      }
    });
  }

  /**
   * Returns all linked vendor ids
   */
  getVendorIds = function() {
    if (this.vendors) {
      return this.vendors.map((vendor: Vendor) => {
        return vendor.id;
      });
    } else {
      return [];
    }
  };

  /**
   * Check if supplied vendor belongs to user
   *
   * @param {number} vendorId
   */
  isOwnVendor(vendorId: number): boolean {
    if(this.getVendorIds().indexOf(vendorId) > -1) return true;
    return false;
  };

  /**
   * Update user details
   *
   * Called from Dashboard screen
   */
  updateUser(user: User) {
    this.user = user;
    this.subject.next({
      event: CONSTANT.EVENT.SESSION.LOGGED_IN
    });
    this.localStorageService.store(
      CONSTANT.LOCALSTORAGE.SESSION,
      this.toJson()
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

  reloadSession = function(sessionDetails: any, sessionToken: any) {
    this.loggedIn             = sessionDetails['loggedIn'];
    this.user                 = sessionDetails['user'];
    this.user.akAccessToken   = sessionToken;
    this.vendors              = sessionDetails['vendors'];
    this.favourites           = sessionDetails['favourites'];
  };

  /**
   * Resets all account details
   *
   * Important: Call on logout and clear everything
   */
  reset = function() {
    this.setLoggedIn(false);
    this.user = new User();
    this.vendors = [];
    this.favourites = [];
  };

  toJson = function() {
    var json: any = {};
    json['loggedIn']   = this.loggedIn;
    json['user']       = this.user;
    //json['vendors']    = this.vendors;
    //json['favourites'] = this.favourites;
    return json;
  };

  /**
   * Store Account settings in local storage
   * Remember details for repeat visits
   */
  updateLocalStorage() {
    this.localStorageService.store(
      CONSTANT.LOCALSTORAGE.SESSION,
      this.toJson()
    );
  };

  /**
   * Clear Account settings from local storage
   * Logout ! :)
   */
  clearLocalStorage() {
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.SESSION
    );
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.TOKEN
    );
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.FAVOURITES
    );
    this.clearListingStorage();
  };

  /**
   * Clear Create Listings cache from local storage
   */
  clearListingStorage() {
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.LISTING_STEP_ONE
    );
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.LISTING_STEP_TWO
    );
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.LISTING_STEP_THREE
    );
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.LISTING_STEP_FOUR
    );
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.LISTING_STEP_FIVE
    );
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.VENDOR_ID
    );
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.VENDOR_IMAGES
    );
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.LISTING_ADDRESS
    );
    this.localStorageService.clear(
      CONSTANT.LOCALSTORAGE.LISTING_EDIT
    );
  };

  /**
   * Send message as observable
   */
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  };

};
