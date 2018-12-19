import {Injectable} from '@angular/core';

import {Headers, RequestOptions, Response} from '@angular/http';
import { AppHttpClient } from '../security/app-http-client';

import {environment} from '../../environments/environment';

import {ApplicationData} from './admission-application';
import {AdmissionResponse} from './admission-response';
import {SummaryData} from './summary-box/summary-data';

@Injectable()
export class AdmissionService {

  private admissionServiceUrl = environment.admissionServiceUrl;

  constructor(private http: AppHttpClient) {}

  updateApplication(application: ApplicationData): Promise<AdmissionResponse> {

    console.log('[AdmissionService] addApplication() ' +
                JSON.stringify(application));

    let data = JSON.stringify(application);
    return this.http.post(this.admissionServiceUrl, data)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getApplicationsBySchool(school_id : String): Promise<ApplicationData[]> {

    console.log('[AdmissionService] Get application by school ' + school_id);

    let url = this.admissionServiceUrl+"/applications/"+school_id;
    return this.http.get(url)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getApplication(application_key: String): Promise<ApplicationData> {

    console.log('[AdmissionService] Get application ' + application_key);

    let url = this.admissionServiceUrl+"/"+application_key;
    return this.http.get(url)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getSummaryBoxDetails(school_id : string): Promise<SummaryData[]>{

    console.log('[SummaryBoxServiceService] Get Summary box details by school ' + school_id);

    let url = this.admissionServiceUrl+"/applications/status/"+school_id;
    return this.http.get(url)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    console.log("[AdmissionService] JSON : ", body);
    return body.data || {};
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
