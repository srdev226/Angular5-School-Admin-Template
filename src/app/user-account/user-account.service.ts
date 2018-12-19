import { Injectable } from '@angular/core';
import {
  Headers,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { UserAccountHttpClient } from './user-account-http-client';

import { UserAccount } from './user-account';
import { UserAccountResponse } from './user-account-response';
import {environment} from '../../environments/environment';


@Injectable()
export class UserAccountService {

  private useraccountServiceUrl = environment.useraccountServiceUrl;

  constructor(private http: UserAccountHttpClient) {}

  addUserAccount(userAccount: UserAccount): Promise<UserAccountResponse> {
    let data = JSON.stringify(userAccount);
    return this.http.put(this.useraccountServiceUrl, data)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  updateUserAccount(user_account: UserAccount){
    let data = JSON.stringify(user_account);
    return this.http.post(this.useraccountServiceUrl,data)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
  }

  getUserAccountDetails(user_account_key: string): Promise<UserAccount> {
    let url = this.useraccountServiceUrl+'/'+user_account_key;
    return this.http.get(url)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getUserList(institutionKey:string): Promise<UserAccount[]>{
    let url = this.useraccountServiceUrl+'/list/school/'+institutionKey;
    return this.http.get(url)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
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
    return Promise.reject(errMsg);
  }
}
