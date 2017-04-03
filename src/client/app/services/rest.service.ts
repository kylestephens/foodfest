import { Injectable }                               from '@angular/core';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class RestService {

  constructor(private http: Http) {}

  public delete = function (url: string, data: any, headers: any, options: any) {
    return this.http
      .delete(url, data, headers)
      .toPromise();
  };

  public get = function (url: string, params?: any, headers?: any, options?: any) {
    let searchParams: URLSearchParams;
    if(params) {
      searchParams = new URLSearchParams();
      for (let key in params) {
        searchParams.set(key, params[key]);
      }
    }

    return this.http
      .get(url, { search: searchParams }, headers)
      .toPromise();
  };

  public post = function (url: string, data: any, headers: any, options: any) {
    var headers = headers || {};
    headers['Content-Type'] = 'application/x-www-form-urlencoded';

    return this.http
      .post(url, data, headers)
      .toPromise();
  };

  /**
   * Use multipart/form-data when your form includes
   * any <input type="file"> elements
   **/
  public postMultiPart = function (url: string, data: any, headers: any, options: any) {
    var headers = headers || {};
    headers['Content-Type'] = 'multipart/form-data';

    return this.http
      .post(url, data, headers)
      .toPromise();
  };

  public put = function (url: string, data: any, headers: any, options: any) {
    return this.http
      .put(url, data,)
      .toPromise()
      .then(response => response.json().data)
      .catch(handleFailure);
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
