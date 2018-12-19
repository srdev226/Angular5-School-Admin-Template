import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {
  Headers,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import {environment} from '../../../environments/environment';
import { Subscription } from './subscription';
import { SubscriptionHttpClient } from './subscription-http-client';

@Injectable()
export class SubscriptionService {

  private subscriptionUrl = environment.subscriptionServiceUrl;

  constructor(private http: SubscriptionHttpClient) { }

  addSubscription(subscription: Subscription): Promise<any> {
    let data = JSON.stringify(subscription);
    return this.http.put(this.subscriptionUrl, data)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  updateSubscription(subscription: Subscription): Promise<any> {
    let data = JSON.stringify(subscription);
    return this.http.post(this.subscriptionUrl, data)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getSubscription(subscription_key: string): Promise<Subscription> {
    let url = this.subscriptionUrl + "/" + subscription_key;
    return this.http.get(url)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getSubscriptionsByService(service_key: string): Promise<Subscription[]> {
    let url = this.subscriptionUrl + "/list/service/" + service_key;
    return this.http.get(url)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getSubscriptionsByStudent(student_key: string): Promise<Subscription[]> {
    let url = this.subscriptionUrl + "/list/subscriber/" + student_key;
    return this.http.get(url)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
