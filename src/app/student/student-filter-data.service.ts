import { Injectable } from '@angular/core';
import { StudentFilter } from './student-list/student-filter/student-filter';

@Injectable()
export class StudentFilterDataService {

  constructor() { }

  private student_filter: StudentFilter;

  setStudentFilter(filter: StudentFilter){
    this.student_filter = filter;
  }

  getStudentFilter(){
    return this.student_filter;
  }

}
