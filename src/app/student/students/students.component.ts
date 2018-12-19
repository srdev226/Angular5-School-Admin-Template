import { Component, OnInit, Input } from '@angular/core';

import { Student } from '../student';
import { StudentInfo } from '../student-info/student-info';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  _students: Student[]

  studentsInfo: StudentInfo[];

  constructor(private studentService: StudentService) { }

  ngOnInit() {
    this.setStudentInfoList()
  }

  @Input()
  public set students(students: Student[]){
    console.log('[StudentsComponent] setting students .....' + students)
    this._students = students;
    this.setStudentInfoList();
  }

  public get students(): Student[]{
    return this._students;
  }

  private setStudentInfoList(){
    this.studentsInfo = [];
    if(this.students){
      for(let student of this.students){
        let studentInfo = new StudentInfo();
        studentInfo.student = student;
        this.setImageUrl(studentInfo);
        this.studentsInfo.push(studentInfo);
      }
    }
  }

  private setImageUrl(studentInfo) {
    if(studentInfo.student.profile_image_key){
      this.studentService.getProfilePicture(studentInfo.student.profile_image_key).then(image_response=>{
        studentInfo.profile_image_url = image_response.url;
        if(!image_response){
          studentInfo.profile_image_url = this.getDefaultUrl(studentInfo.student.gender);
        }
      });
    }else{
      studentInfo.profile_image_url = this.getDefaultUrl(studentInfo.student.gender);
    }
  }

  private getDefaultUrl(gender){
    if (gender && gender.toLowerCase() == 'male') {
      return 'assets/images/boy.png';
    } else {
      return 'assets/images/girl.png';
    }
  }

}
