import { Injectable }     from '@angular/core';

// NOTE: 3rd party (non-typescript) library - https://apis.google.com/js/client.js
// Declaration is necessary to trick IDE so it will not throw IDE errors.
declare var gapi: any;

@Injectable()
export class GoogleService {

  private clientId: string = '1021678981609-gjuqj2klp4f3ri69a4nqbjknm0079n6c.apps.googleusercontent.com';
  private apiKey = '{API_KEY}';
  private scopes = 'email';
  private domain = 'http://localhost:5555';
  private GP_SHARE_LINK = 'https://plus.google.com/share?url=';
  private defer: Promise<any> = null;

  login = function() {
    var request = {
      client_id: this.clientId,
      scope: this.scopes,
      immediate: false,
      hd: this.domain
    }, callback = this.handleAuthResult;

    this.defer = new Promise((resolve, reject) => {
      gapi.auth.authorize(
        request, callback.bind(this, resolve, reject)
      );
    });
    return this.defer;
  };

  share = function(link: string, width: number, height: number) {
    var winWidth = width || 550,
      winHeight = height || 360;

    var y = window.outerHeight / 2 + window.screenY - ( winHeight / 2);
        var x = window.outerWidth / 2 + window.screenX - ( winWidth / 2);

    window.open(
      this.GP_SHARE_LINK + link,
      'Google+',
      'toolbar=no, location=no, directories=no,' +
      'status=no, menubar=no, scrollbars=no,' +
      'resizable=no, copyhistory=no, width=' +
      winWidth + ',height=' + winHeight +
      ', top=' + y + ', left=' + x
    );
  };

  handleAuthResult = function(resolve: Function, reject: Function, authResult: any) {
    var _token = this.token;
    if (authResult && !authResult.error) {
      return gapi.client.load('oauth2', 'v2', () => {
        var request = gapi.client.oauth2.userinfo.get();
        request.execute(function (resp: any) {
          resolve(resp);
        });
      });
    } else {
      reject('error!');
    }
  };

};
