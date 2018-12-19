import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {
  Headers,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import {environment} from '../../../environments/environment';
import { Trip } from './trip';
import { TripHttpClient } from './trip-http-client';
import { TripLogHttpClient } from './trip-logs/trip-log-http-client';

@Injectable()
export class TripService {

  private tripUrl = environment.tripServiceUrl;

  constructor(private http: TripHttpClient) { }

  addTrip(trip: Trip): Promise<any> {
    let data = JSON.stringify(trip);
    return this.http.put(this.tripUrl, data)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }


  updateTrip(trip: Trip): Promise<any> {
    let data = JSON.stringify(trip);
    return this.http.post(this.tripUrl, data)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getTrip(trip_key: string): Promise<Trip> {
    let url = this.tripUrl + "/" + trip_key;
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
