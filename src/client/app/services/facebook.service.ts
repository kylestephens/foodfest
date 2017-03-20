import { Injectable, NgZone }   from '@angular/core';
import { BehaviorSubject }      from 'rxjs/BehaviorSubject';

import { CONSTANT }             from '../core/constant';

// NOTE: 3rd party (non-typescript) library - https://apis.google.com/js/client.js
// Declaration is necessary to trick IDE so it will not throw IDE errors.
declare var FB: any;

@Injectable()
export class FacebookService {

  private defer: Promise<any> = null;
  public ready = new BehaviorSubject<boolean>(false);

  constructor(private zone: NgZone) {
    this.loadSdkAsync(() => {
      FB.init({
        appId:   "280199502420160",
        status:  false,
        xfbml:   false,
        version: "v2.8"
      });
      this.ready.next(true);
    });
  };

  public login = function() {
    var me = this;
    this.defer = new Promise((resolve, reject) => {
      FB.getLoginStatus(response => {
        me.statusChangeCallback(resolve, reject, response);
      });
    });
    return this.defer;
  };

  private statusChangeCallback = function(resolve: Function, reject: Function, response: any) {
    if (response && response.status && response.status === 'connected') {
      this._facebookDetails(resolve);
    } else {
      // the user isn't logged in to Facebook.
      FB.login(
        this.statusChangeCallback.bind(this, resolve, reject),
        {
          scope: 'email',
          return_scopes: true
        }
      );
    }
  };

  private loadSdkAsync(callback: () => void) {
    window.fbAsyncInit = () => this.zone.run(callback);
    // Load the Facebook SDK asynchronously
    const s = "script";
    const id = "facebook-jssdk";
    var js, fjs = document.getElementsByTagName(s)[0];
    if (document.getElementById(id)) return;
    js = document.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  };

  private _facebookDetails(resolve: Function) {
    FB.api('/me?fields=name,email,picture', (response: any) => {
      resolve(response);
    });
  };

};
