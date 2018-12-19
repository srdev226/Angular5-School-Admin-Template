import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {
  Headers,
  RequestOptions,
  Response
} from '@angular/http';
import {environment} from '../../../environments/environment';
import { Attendance } from './attendance';
import { AttendanceHttpClient } from './attendance-http-client';

@Injectable()
export class AttendanceService {

  private attendanceUrl = environment.attendanceServiceUrl;

  constructor(private http: AttendanceHttpClient)
  { }

  addAttendance(attendance: Attendance): Promise<any> {

    let data = JSON.stringify(attendance);

    return this.http.put(this.attendanceUrl, data)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  getAttendanceBySchool(school_key: string): Promise<Attendance[]> {
    let url = this.attendanceUrl+'/list/school/'+school_key;
    return this.http.get(url)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  getAttendanceByStudent(student_key: string): Promise<any> {
    let url = this.attendanceUrl+'/list/student/'+student_key;
    return this.http.get(url)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  getAttendanceByDate(absent_param: Attendance): Promise<Attendance[]>{

    let url = this.attendanceUrl + "/list";

    return this.http.post(url,absent_param)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError)
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
