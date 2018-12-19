import {Injectable} from '@angular/core';
import { Http, Headers} from '@angular/http';

import {environment} from '../../environments/environment';

@Injectable()
export class AppHttpClient {

  constructor(private http: Http) {}

  createAuthorizationHeader(headers: Headers) {
    let username : string = environment.securityUser;
    let password : string = environment.securityPassword;

    headers.append("Authorization", "Basic " + btoa(username + ":" + password));
    headers.append("Content-Type", "application/json");
  }

  get(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  post(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }

  put(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.put(url, data, {
      headers: headers
    });
  }
}
