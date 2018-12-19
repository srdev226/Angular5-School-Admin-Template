import { Injectable } from '@angular/core';

import { Student } from './student';

@Injectable()
export class StudentDataService {

  private students: Student[];

  constructor() { }

  setStudents(st: Student[]){
    this.students = st;
  }

  getStudents(): Student[]{
    return this.students;
  }

}
