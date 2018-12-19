import 'rxjs/add/operator/toPromise';
import {Injectable} from '@angular/core';
import {Headers, RequestOptions, Response, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { AppHttpClient } from '../../security/app-http-client';

import {environment} from '../../../environments/environment';
import {School} from './school';
import { SchoolResponse } from './school-response';

@Injectable()
export class SchoolService {

  private schoolAdminUrl = environment.schoolAdminServiceUrl;

  constructor(private http: AppHttpClient) {}

  updateSchool(school: School): Promise<SchoolResponse> {

    console.log('[SchoolAdminService] School() ' +
                JSON.stringify(school));

    let data = JSON.stringify(school);

    return this.http.post(this.schoolAdminUrl, data)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  getSchool(school_id: string): Promise<School> {

    let url = this.schoolAdminUrl + "/" + school_id;

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
