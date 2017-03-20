import { Injectable }        from '@angular/core';
import { Observable }        from 'rxjs';
import { Subject }           from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import { RestService }       from './rest.service';
import { Http, Response }    from '@angular/http';

import { CONSTANT }          from '../core/constant';
import { SettingsService }   from './settings.service';

@Injectable()
export class AccountService {

  private subject = new Subject<any>();

  private loggedIn = false;
  private facebookLogin = false;
  private googleLogin = false;
  private email = '';
  private name = '';
  private password = '';
  private akAccessToken = '';
  private fbAccessToken = '';
  private fb_userid = '';
  private google_userid = '';
  private profilePictureUrl = '';

  constructor(
    private restService: RestService,
    private settingsService: SettingsService
  ) {};

  createAccount = function() {
    return this.restService.post(
      this.settingsService.getServerBaseUrl() + '/users/register', {
        email: this.email,
        user_type: 1,
        password: this.password,
        firstname: this.name,
        facebook_user_id: this.fb_userid,
        google_user_id: this.google_userid
        //imagePath: this.profilePictureUrl
      }
    );
  };

  login = function() {
    return this.restService.post(
      this.settingsService.getServerBaseUrl() + '/users/login', {
        email: this.email,
        firstname: this.name,
        password: this.password,
        facebook_user_id: this.fb_userid,
        google_user_id: this.google_userid,
        imagePath: this.profilePictureUrl
      }
    );
  };

  isLoggedIn = function () {
    return this.loggedIn;
  };

  setLoggedIn = function (newSessionStatus: boolean) {

    console.debug('AccountService::setLoggedIn');
    if(this.loggedIn !== newSessionStatus) {
      this.subject.next({
        event: CONSTANT.EVENT.SESSION.LOGGED_IN,
        sessionStatus: newSessionStatus
      });
      this.loggedIn = newSessionStatus;
    }

    // if(this.loggedIn) {
    //   localStorageService.set(
    //     CONSTANT.LOCALSTORAGE.SESSION,
    //     this.toJson()
    //   );
    //   localStorageService.set(
    //     CONSTANT.LOCALSTORAGE.TOKEN,
    //     this.getListrAccessToken()
    //   );
    // } else {
    //   localStorageService.remove(
    //     CONSTANT.LOCALSTORAGE.SESSION,
    //     CONSTANT.LOCALSTORAGE.TOKEN
    //   );
    // }

  };

  setFacebookLogin = function(loginStatus: boolean) {
    this.facebookLogin = loginStatus;
  };

  getFacebookLogin = function() {
    return this.facebookLogin;
  };

  setGoogleLogin = function(loginStatus: boolean) {
    this.googleLogin = loginStatus;
  };

  getGoogleLogin = function() {
    return this.googleLogin;
  };

  getEmail = function() {
    return this.email;
  };

  setEmail = function(emailAddress: string) {
    this.email = emailAddress;
  };

  getPassword = function() {
    return this.email;
  };

  setPassword = function(pw: string) {
    this.password = pw;
  };

  getFirstName = function () {
    return this.name.split(' ')[0];
  };

  getLastName = function () {
    return this.name.split(' ').slice(-1).pop();
  };

  getName = function () {
    return this.name;
  };

  setName = function (fullName: string) {
    this.name = fullName;
  };

  setAkAccessToken = function(accessToken: string) {
    this.akAccessToken = accessToken;
  };

  getAkAccessToken = function() {
    return this.akAccessToken;
  };

  getFacebookAccessToken = function() {
    return this.fbAccessToken;
  };

  setFacebookAccessToken = function(accTok: string) {
    this.fbAccessToken = accTok;
  };

  getFacebookId = function() {
    return this.fb_userid;
  };

  setFacebookId = function(ident: string) {
    this.fb_userid = ident;
  };

  getGoogleId = function() {
    return this.google_userid;
  };

  setGoogleId = function(ident: string) {
    this.google_userid = ident;
  };

  getProfilePictureUrl = function () {
    return this.profilePictureUrl;
  };

  setProfilePictureUrl = function(profPicUrl: string) {
    this.profilePictureUrl = profPicUrl;
  };

  setFacebookDetails = function(response: any) {
    this.setFacebookId(response.id);
    this.setName(response.name);
    this.setEmail(response.email);
    if(!response.picture.data.is_silhouette) {
      this.setProfilePictureUrl(response.picture.data.url);
    }
    this.setFacebookLogin(true);
  };

  setGoogleDetails = function(response: any) {
    this.setGoogleId(response.id);
    this.setName(response.name);
    this.setEmail(response.email);
    if(response.picture) {
      this.setProfilePictureUrl(response.picture);
    }
    this.setGoogleLogin(true);
  };

  reloadSession = function(sessionDetails: any, sessionToken: any) {
    this.loggedIn = sessionDetails['loggedIn'];
    this.facebookLogin = sessionDetails['facebookLogin'];
    this.googleLogin = sessionDetails['googleLogin'];
    this.email = sessionDetails['email'];
    this.name = sessionDetails['name'];
    this.listrAccessToken = sessionToken;
    this.fbAccessToken = sessionDetails['fbAccessToken'];
    this.fb_userid = sessionDetails['fb_userid'];
    this.google_userid = sessionDetails['google_userid'];
    this.profilePictureUrl = sessionDetails['profilePictureUrl'];
  };

  reset = function() {
    this.setLoggedIn(false);
    this.facebookLogin = false;
    this.googleLogin = false;
    this.email = '';
    this.name = '';
    this.listrAccessToken = '';
    this.fbAccessToken = '';
    this.fb_userid = '';
    this.google_userid = '';
    this.profilePictureUrl = '';
  };

  toJson = function() {
    var json: any = {};
    json['loggedIn'] = this.loggedIn;
    json['facebookLogin'] = this.facebookLogin;
    json['googleLogin'] = this.googleLogin;
    json['email'] = this.email;
    json['name'] = this.name;
    json['fbAccessToken'] = this.fbAccessToken;
    json['fb_userid'] = this.fb_userid;
    json['google_userid'] = this.google_userid;
    json['profilePictureUrl'] = this.profilePictureUrl;
    return json;
  };

  /**
  * Send message as observable
  */
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

};
