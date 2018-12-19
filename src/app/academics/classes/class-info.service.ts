import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {
  Headers,
  RequestOptions,
  Response
} from '@angular/http';
import { environment } from '../../../environments/environment';
import { ClassInfo } from './class-info';
import { ClassInfoHttpClient } from './class-info-http-client';

@Injectable()
export class ClassInfoService {

  private classinfoUrl = environment.classesServiceUrl;

  constructor(private http: ClassInfoHttpClient) { }

  addClassInfo(class_info: ClassInfo): Promise<any> {
    let data = JSON.stringify(class_info);
    return this.http.put(this.classinfoUrl, data)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  updateClassInfo(class_info: ClassInfo): Promise<any> {
    let data = JSON.stringify(class_info);
    return this.http.post(this.classinfoUrl, data)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getClassInfo(class_info_key: string): Promise<ClassInfo> {
    let url = this.classinfoUrl + "/" + class_info_key;
    return this.http.get(url)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getClassInfoList(school_key: string): Promise<ClassInfo[]> {
    let url = this.classinfoUrl + "/list/school/" + school_key;
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
