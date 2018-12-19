import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { AppHttpClient } from '../../security/app-http-client';

import {environment} from '../../../environments/environment';
import { Institution } from './institution';

@Injectable()
export class InstitutionService {

  private url = environment.institutionServiceUrl;

  constructor(private http: AppHttpClient) { }

  addInstitution(institution: Institution): Promise<any> {

    let data = JSON.stringify(institution);

    return this.http.put(this.url, data)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  updateInstitution(institution: Institution): Promise<any> {

    let data = JSON.stringify(institution);

    return this.http.post(this.url, data)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  getInstituitionList(schoolManagementKey: string): Promise<Institution[]>{

    let url = this.url + "/list/" + schoolManagementKey;

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
