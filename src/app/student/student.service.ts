import { Injectable } from '@angular/core';
import {
  Headers,
  Http,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { AppHttpClient } from '../security/app-http-client';
import { Student, GenderType } from './student';
import { StudentResponse } from './student-response';
import { SchoolStudentData, ClassStudentData } from './school-student-data';
import {environment} from '../../environments/environment';


@Injectable()
export class StudentService {

  private studentUrl = environment.studentServiceUrl;
  private fileManagementServiceUrl = environment.fileManagementServiceUrl;

  constructor(private http: AppHttpClient,
              private httpObject:Http)
  { }

  addStudent(student: Student): Promise<StudentResponse> {

    let data = JSON.stringify(student);

    return this.http.put(this.studentUrl, data)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  updateStudent(student: Student): Promise<StudentResponse> {

    let data = JSON.stringify(student);

    return this.http.post(this.studentUrl, data)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  getStudentList(school_id: string): Promise<Student[]>{

    let url = this.studentUrl + "/list/" + school_id;

    return this.http.get(url)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError)
  }

  getStudent(studentKey: string): Promise<Student>{

    let url = this.studentUrl + "/" + studentKey;

    return this.http.get(url)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError)
  }

  issuTC(studentKey: string): Promise<any>{
    let data_string = {
    "student_key": studentKey
   }
    let data = JSON.stringify(data_string);
    let url : string =this.studentUrl+'/issuetc'
    return this.http.post(url , data)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError)
  }


  saveProfilePicture(image : File): Promise<any> {

    let url : string = this.fileManagementServiceUrl+'/uploadfile';
    let headers = new Headers();

    let options = new RequestOptions({headers : headers});

    let data = JSON.stringify(image);
    let formData = new FormData();
    formData.append('file',image);

    return this.httpObject.post(url, formData,options)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  getProfilePicture(profile_image_key: string): Promise<any> {
    let url : string = this.fileManagementServiceUrl+'/downloadfile/'+profile_image_key;

    return this.http.get(url)
    .toPromise()
    .catch(this.handleError);
  }

  getProfilePictureUrl(profile_image_key: string) {
    return (this.fileManagementServiceUrl + '/downloadfile/' + profile_image_key) ;
  }

  deleteProfilePicture(profile_image_key : string) : Promise<any> {
    let url : string = this.fileManagementServiceUrl+'/deletefile/'+profile_image_key;
    let headers = new Headers();
    let options = new RequestOptions({headers : headers});
    return this.http.post(url, options)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  getSchoolStudentData(school_id: string): Promise<SchoolStudentData>{
    return this.getStudentList(school_id).then(resp => {
      return this.processStudentData(resp);
    })
  }

  private processStudentData(student_list: Student[]): SchoolStudentData{
    let school_student_data = new SchoolStudentData();
    let class_students_map = new Map<string,ClassStudentData>();
    for(let student of student_list){
      let hash = student.current_class+student.division;
      let class_student_data = class_students_map.get(hash);
      if(!class_student_data){
        class_student_data = new ClassStudentData();
        class_student_data.class_name = student.current_class;
        class_student_data.division_name = student.division;
        class_students_map.set(hash, class_student_data);
      }
      if(student.gender+'' === 'Male'){
        class_student_data.boys_count = class_student_data.boys_count + 1;
      }else{
        class_student_data.girls_count = class_student_data.girls_count + 1;
      }
    }
    school_student_data.class_student_data = Array.from(class_students_map.values());
    for(let class_st_data of school_student_data.class_student_data ){
      school_student_data.total_boys_count = school_student_data.total_boys_count + class_st_data.boys_count;
      school_student_data.total_girls_count = school_student_data.total_girls_count + class_st_data.girls_count;
    }
    return school_student_data;
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
