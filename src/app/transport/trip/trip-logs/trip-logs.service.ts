import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {
  Headers,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import {environment} from '../../../../environments/environment';
import { TripLog } from './trip-log';
import { TripLogHttpClient } from './trip-log-http-client';
@Injectable()
export class TripLogsService {

  private tripLogUrl = environment.triplogServiceUrl;

  constructor(private http: TripLogHttpClient) { }

  getLatestTripLog(trip_key: string): Promise<any> {
    let url = this.tripLogUrl + "/trip/latest/" + trip_key;
    return this.http.get(url)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getTripLogs(trip_key: string): Promise<any> {
    let url = this.tripLogUrl + "/list/trip/" + trip_key;
    return this.http.get(url)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getTripLog(trip_log_key: string): Promise<any> {
    let url = this.tripLogUrl + "/" + trip_log_key;
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
