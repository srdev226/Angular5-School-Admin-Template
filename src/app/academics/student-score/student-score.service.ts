import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {
  Headers,
  RequestOptions,
  Response
} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {environment} from '../../../environments/environment';
import { StudentScoreHttpClient } from './student-score-http-client';
import { StudentScore } from './student-score';

@Injectable()
export class StudentScoreService {

  private studentScoreServiceUrl = environment.studentScoreServiceUrl;

  constructor(private http: StudentScoreHttpClient) {}

  addStudentScore(score: StudentScore): Promise<any> {

    let data = JSON.stringify(score);

    return this.http.put(this.studentScoreServiceUrl, data)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  updateStudentScore(score: StudentScore): Promise<any> {

    let data = JSON.stringify(score);

    return this.http.post(this.studentScoreServiceUrl, data)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  getStudentScoreForExam(exam_key: string): Promise<StudentScore[]> {
    return this.http.get(this.studentScoreServiceUrl+'/exam/list/'+exam_key)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  getStudentScore(student_key: string): Promise<StudentScore[]> {
    return this.http.get(this.studentScoreServiceUrl+'/student/list/'+student_key)
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
