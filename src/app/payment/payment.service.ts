import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {
  Headers,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import {environment} from '../../environments/environment';
import { PaymentInfo } from './payment-info';
import { AppHttpClient } from '../security/app-http-client';

@Injectable()
export class PaymentService {

  private paymentUrl = environment.paymentServiceUrl;

  constructor(private http: AppHttpClient) { }

  addPayment(payment: PaymentInfo): Promise<any> {

    let data = JSON.stringify(payment);

    return this.http.put(this.paymentUrl, data)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getPayment(payment_key: string): Promise<PaymentInfo> {

    let url = this.paymentUrl + "/" + payment_key;
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
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
