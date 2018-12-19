import { Injectable } from '@angular/core';
import {
  Headers,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import { environment } from '../../../environments/environment';
import { FeeReportHttpClient } from './fee-report-http-client';
import { FeeReport } from './fee-report';


@Injectable()
export class FeeReportService {
  private feereportUrl = environment.feereportServiceUrl;

  constructor(private http: FeeReportHttpClient) { }

  getFeeReports(school_key: string): Promise<FeeReport[]>{

    let url = this.feereportUrl + "/list/school/" + school_key;

    return this.http.get(url)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError)
  }

  getFeeReportByType(report_param: FeeReport): Promise<FeeReport[]>{

    let url = this.feereportUrl + "/list";

    return this.http.post(url,report_param)
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
