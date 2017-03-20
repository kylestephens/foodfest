import { Injectable }                 from '@angular/core';
import { Headers, Http, Response }    from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RestService {

  constructor(private http: Http) {}

  public delete = function (url: string, data: any, headers: any, options: any) {
    return this.http
      .delete(url, data, headers)
      .toPromise()
      .then(response => response.json().data)
      .catch(handleFailure);
  };

  public get = function (url: string, headers: any, options: any) {
    return this.http
      .get(url, headers)
      .toPromise()
      .then(response => response.json().data)
      .catch(handleFailure);
  };

  public post = function (url: string, data: any, headers: any, options: any) {
    var headers = headers || {};
    headers['Content-Type'] = 'application/x-www-form-urlencoded';

    return this.http
      .post(url, urlEncode(data), headers)
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

function makeRequest(http: Http, method: string, url: string, data: any, headers: any, options: any) {


  // return $http({
  //   method: method,
  //   url: url,
  //   data: data,
  //   headers: headers
  //   //timeout: config.restCallTimeout * 1000
  // }).then(function (response: any) {
  //   return response.data;
  // }).catch(function (error: any) {
  //   //translateErrorCode(error);
  //   //transferRequestId(error);
  //   //handleFailure(error, options);
  //   return $q.reject(error);
  // });

};

function urlEncode(data: any) {
  var str = [];
  for(var o in data) {
    str.push(encodeURIComponent(o) + "=" + encodeURIComponent(data[o]));
  }
  return str.join("&");
};
