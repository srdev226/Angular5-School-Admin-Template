import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable }     from 'rxjs/Observable';
import { LoginHttpClient } from './login-http-client';

import { LoginDetails }  from './login-details';
import { LoginResponse } from './login-response';
import { TokenValidationResponse } from './token-validation-response';
import { environment } from '../../environments/environment';

@Injectable()
export class LoginService {

  private authenticationUrl = environment.authenticationServiceUrl;
  private partnerKey = environment.partnerKey;
  private userAppPartnerKey = environment.userAppPartnerKey;

  constructor(private http: LoginHttpClient) { }

  checkUsernameExistsInUserApp(username : string): Promise<Boolean>{
    let url = this.authenticationUrl+'/checkusernameexists?partnerKey='+this.userAppPartnerKey+'&username='+username;
    return this.http.get(url)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  login(loginDetails: LoginDetails): Promise<LoginResponse> {

  	console.log('[LoginService] login() ' + loginDetails.username);

  	let data = { "partnerKey":this.partnerKey, "username":loginDetails.username, "password":loginDetails.password, "institutionKey": loginDetails.institutionKey};

  	console.log(data, this.authenticationUrl);

  	return this.http.post(this.authenticationUrl, data)
  					.toPromise()
  					.then(this.extractData)
  					.catch(this.handleError);
  }

  registerAppUser(accountKey: string, loginDetails: LoginDetails){
    return this.registerUser(this.authenticationUrl + '/autoenroll', this.userAppPartnerKey,
                             accountKey, loginDetails);
  }

  registerAdminUser(accountKey: string, loginDetails: LoginDetails){
    return this.registerUser(this.authenticationUrl, this.partnerKey,
                             accountKey, loginDetails);
  }

  registerUser(url:string, partnerKey:string, accountKey: string, loginDetails: LoginDetails) {
    let data = {"partnerKey":partnerKey,
                "accountKey":accountKey,
                "username":loginDetails.username,
                "password":loginDetails.password,
                "institutionKey": loginDetails.institutionKey};

    return this.http.put(url, data)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
  }

  validateToken(token:string) : Promise<TokenValidationResponse>{

    console.log('[LoginService] validateToken() ' + token);

  	let url = this.authenticationUrl+'/token?tokenKey='+token;

  	return this.http.get(url)
  					.toPromise()
  					.then(this.extractData)
  					.catch(this.handleError);
  }

  private extractData(res: Response) {
  	console.log('Extracting Data ....' + res);
    let body = res.json();
    console.log('Body ....' + body.data);
    return body.data;
    //return body.data || { };
  }

  private handleError (error: Response | any) {
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
