import { Injectable } from '@angular/core';
import {
  Headers,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { AppHttpClient } from '../../security/app-http-client';
import {environment} from '../../../environments/environment';

import { SchoolManagement } from './school-management';

@Injectable()
export class SchoolManagementService {

  private schoolmanagementServiceUrl = environment.schoolmanagementServiceUrl;

  constructor(private http: AppHttpClient) { }

  getManagement(school_management_key: string):Promise<SchoolManagement>{

    let url = this.schoolmanagementServiceUrl+'/'+school_management_key;

    return this.http.get(url)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  addManagement(school_management:SchoolManagement):Promise<any>{

      let data = JSON.stringify(school_management);

      return this.http.put(this.schoolmanagementServiceUrl, data)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  updateManagement(school_management:SchoolManagement):Promise<any>{

      let data = JSON.stringify(school_management);

      return this.http.post(this.schoolmanagementServiceUrl, data)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
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
