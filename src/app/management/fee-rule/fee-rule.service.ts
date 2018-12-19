import { Injectable } from '@angular/core';
import {
  Headers,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { AppHttpClient } from '../../security/app-http-client';

import { FeeRule } from './fee-rule';
import { FeeRuleResponse } from './fee-rule-response';
import {environment} from '../../../environments/environment';

@Injectable()
export class FeeRuleService {

  private feeruleUrl = environment.feeruleServiceUrl;

  constructor(private http: AppHttpClient) { }

  addFeeRule(feeRule: FeeRule): Promise<FeeRuleResponse> {

    let data = JSON.stringify(feeRule);

    return this.http.put(this.feeruleUrl, data)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  updateFeeRule(feeRule: FeeRule): Promise<FeeRuleResponse> {

    let data = JSON.stringify(feeRule);

    return this.http.post(this.feeruleUrl, data)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }


  getFeeRule(fee_rule_Key: string): Promise<FeeRule>{

    let url = this.feeruleUrl + "/" + fee_rule_Key;

    return this.http.get(url)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError)
  }

  getFeeRulesList(school_key: string): Promise<FeeRule[]>{

    let url = this.feeruleUrl + "/list/" + school_key;

    return this.http.get(url)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError)
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

  private handleError(error: any): Promise<any> {
    let message : any = "";
    if (error.status === 400 || error.status === "400" ) {
      message = Observable.name;
    }
    else {
      message = Observable.throw(new Error(error.status));
    }
    return message;
  }

}
