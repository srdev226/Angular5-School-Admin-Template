import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {
  Headers,
  RequestOptions,
  Response
} from '@angular/http';
import {environment} from '../../../../environments/environment';
import { FeeReceipt } from './fee-receipt'
import { FeeReceiptHttpClient } from './fee-receipt-http-client';


@Injectable()
export class FeeReceiptService {

  private receiptUrl = environment.receiptServiceUrl;

  constructor(private http:FeeReceiptHttpClient) { }

  getFeeReceiptByStudent(student_key: string): Promise<FeeReceipt[]> {
    let url = this.receiptUrl + "/list/student/" + student_key;
    return this.http.get(url)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getFeeReceiptBySchool(school_key: string): Promise<FeeReceipt[]> {
    let url = this.receiptUrl + "/list/school/" + school_key;
    return this.http.get(url)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getFeeReceipt(receipt_key: string): Promise<FeeReceipt> {
    let url = this.receiptUrl + "/" + receipt_key;
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
