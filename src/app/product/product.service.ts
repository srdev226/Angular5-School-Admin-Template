import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {
  Headers,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import {AppHttpClient} from '../security/app-http-client';

import {Product} from './product';

@Injectable()
export class ProductService {

  private productServiceUrl = environment.productServiceUrl;
  private masterProductKey = environment.masterProductKey;
  private productKey = environment.productKey;

  constructor(private http: AppHttpClient) {}

  getProduct(): Promise<Product>{
    return this.getProductData(this.productKey);
  }

  getMasterProduct(): Promise<Product>{
    return this.getProductData(this.masterProductKey);
  }

  private getProductData(p_key): Promise<Product> {

    let url = this.productServiceUrl + "/" + p_key;

    return this.http.get(url)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    console.log("[PersonService] JSON : ", body);
    return body.data || {};
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
