import { Injectable }         from '@angular/core';

import {
  Headers,
  Http,
  Response,
  URLSearchParams,
  RequestOptions
}                             from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class RestService {

  constructor(private http: Http) {}

  public delete = function (url: string, data: any, headers: any, options: any) {
    return this.http
      .delete(url, data, headers)
      .toPromise();
  };

  // TODO - handle timeouts better, e.g. if server is down / slow
  public get = function (url: string, params?: any, token?: string) {
    let headers: Headers = new Headers();
    if(token) {
      headers.append('Authorization', token);
    }

    let searchParams: URLSearchParams;
    if(params) {
      searchParams = new URLSearchParams();
      for (let key in params) {
        searchParams.set(key, params[key]);
      }
    }

    let options = new RequestOptions({ headers: headers, search: searchParams });

    return this.http
      .get(url, options)
      .toPromise();
  };

  public post = function (url: string, data: any, token?: string, options?: any) {
    let headers: Headers = new Headers();
    if(token) {
       headers.append('Authorization', token);
     }
    //headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post(url, data, { headers: headers })
      .toPromise();
  };

  /**
   * Use multipart/form-data when your form includes
   * any <input type="file"> elements
   */
  public postMultiPart = function (url: string, data: any, headers: any, options: any) {
    var headers = headers || {};
    headers['Content-Type'] = 'multipart/form-data';

    return this.http
      .post(url, data, headers)
      .toPromise();
  };

  public put = function (url: string, data: any, token?: any, options?: any) {
    let headers: Headers = new Headers();
    if(token) {
      headers.append('Authorization', token);
    }

    return this.http
      .put(url, data, { headers: headers })
      .toPromise();
  };

};

// Private methods
function handleFailure(error: any, options: any) {
};

function translateErrorCode(response: any) {
};

function transferRequestId(response: any) {
};

function urlEncode(data: any) {
  var str = [];
  for(var o in data) {
    str.push(encodeURIComponent(o) + "=" + encodeURIComponent(data[o]));
  }
  return str.join("&");
};
