import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {
  Headers,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import {environment} from '../../../environments/environment';
import { Route } from './route';
import { AppHttpClient } from '../../security/app-http-client';

@Injectable()
export class RouteService {

  private routeUrl = environment.routeServiceUrl;

  constructor(private http: AppHttpClient) { }

  addRoute(route: Route): Promise<any> {

    let data = JSON.stringify(route);

    return this.http.put(this.routeUrl, data)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  updateRoute(route: Route): Promise<any> {

    let data = JSON.stringify(route);

    return this.http.post(this.routeUrl, data)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getRoute(route_key: string): Promise<Route> {

    let url = this.routeUrl + "/" + route_key;
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
