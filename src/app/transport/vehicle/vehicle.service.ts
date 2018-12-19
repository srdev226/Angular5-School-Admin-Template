import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {
  Headers,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import {environment} from '../../../environments/environment';
import { Vehicle } from './vehicle';
import { VehicleHttpClient } from './vehicle-http-client';

@Injectable()
export class VehicleService {

  private vehicleUrl = environment.vehicleServiceUrl;

  constructor(private http: VehicleHttpClient) { }

  addVehicle(vehicle: Vehicle): Promise<any> {
    let data = JSON.stringify(vehicle);
    return this.http.put(this.vehicleUrl, data)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  updateVehicle(vehicle: Vehicle): Promise<any> {
    let data = JSON.stringify(vehicle);
    return this.http.post(this.vehicleUrl, data)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getVehicle(vehicle_key: string): Promise<Vehicle> {
    let url = this.vehicleUrl + "/" + vehicle_key;
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
