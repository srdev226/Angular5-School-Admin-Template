
import { Injectable } from '@angular/core';
import {
  Headers,
  Http,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';

import { EmployeeHttpClient} from './employee-http-client';
import { Employee } from './employee';

@Injectable()
export class EmployeeService {

  private employeeServiceUrl = environment.employeeServiceUrl;
  private fileManagementServiceUrl = environment.fileManagementServiceUrl;
  private partnerKey = environment.partnerKey;

  constructor(private http: EmployeeHttpClient,
              private httpObject:Http)
  { }

  addEmployee(employee: Employee): Promise<any> {

    employee.partner_key = this.partnerKey;
    let data = JSON.stringify(employee);

    return this.http.put(this.employeeServiceUrl, data)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  getEmployee(employee_key: string): Promise<Employee> {

    let url = this.employeeServiceUrl+"/"+employee_key;

    return this.http.get(url)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  updateEmployee(employee: Employee): Promise<any> {

    let data = JSON.stringify(employee);

    return this.http.post(this.employeeServiceUrl, data)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  getEmployeeList(school_id: string): Promise<Employee[]> {

    let url = this.employeeServiceUrl+"/list/institution/"+school_id;

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
