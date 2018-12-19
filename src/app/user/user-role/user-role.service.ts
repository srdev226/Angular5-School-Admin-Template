import { Injectable } from '@angular/core';
import {
  Headers,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { AppHttpClient } from '../../security/app-http-client';
import { UserRole } from './user-role';
import {environment} from '../../../environments/environment';


@Injectable()
export class UserRoleService {

  private userroleServiceUrl =  environment.userRoleServiceUrl;

  constructor(private http: AppHttpClient) {}

  getUserRoleDetails(user_role_key : string): Promise<UserRole>{
    console.log('[UserRoleService] getUserRoleDetails ' +user_role_key);

    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers});
    return this.http.get(this.userroleServiceUrl + '/' + user_role_key)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
  }

  addUserRole(user_role : UserRole): Promise<UserRole>{
    console.log('[UserRoleService] addUserRole ' +user_role.role_name);

    let data = JSON.stringify(user_role);

  	return this.http.put(this.userroleServiceUrl,data)
  					.toPromise()
  					.then(this.extractData)
  					.catch(this.handleError);

  }

  updateUserRole(user_role : UserRole): Promise<UserRole>{
    console.log('[UserRoleService] updateUserRole ' +user_role.role_name);

    let data = JSON.stringify(user_role);

    return this.http.post(this.userroleServiceUrl,data)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);

  }

  private extractData(res: Response) {
    console.log('Extracting Data ....' + res);
    let body = res.json();
    console.log('Body ....' + body.data);
    // return body;
    return body.data || {};
  }

  private handleError(error: Response|any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }
}
