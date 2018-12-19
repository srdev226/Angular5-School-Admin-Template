import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {
  Headers,
  RequestOptions,
  Response
} from '@angular/http';
import { environment } from '../../../environments/environment';
import { Exam } from './exam';
import { ExamHttpClient } from './exam-http-client';

@Injectable()
export class ExamService {

  private examServiceUrl = environment.examServiceUrl;

  constructor(private http: ExamHttpClient) { }

  addExam(exam: Exam): Promise<any> {
    let data = JSON.stringify(exam);
    return this.http.put(this.examServiceUrl, data)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  updateExam(exam: Exam): Promise<any> {
    let data = JSON.stringify(exam);
    return this.http.post(this.examServiceUrl, data)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getExamDetails(exam_key: string): Promise<Exam> {
    return this.http.get(this.examServiceUrl+'/'+exam_key)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getExamList(exam): Promise<Exam[]> {
    let data = JSON.stringify(exam);
    return this.http.post(this.examServiceUrl+'/list', data)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getExamListByClass(class_key): Promise<Exam[]> {
    let data = JSON.stringify(class_key);
    return this.http.post(this.examServiceUrl+'/list/class', data)
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
