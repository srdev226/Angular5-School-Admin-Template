import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FeeBill } from '../fee-bill/fee-bill';
import { FeeBillService } from '../fee-bill/fee-bill.service';

import { SchoolDataService } from '../../management/school/school-data.service';
import { Student } from '../../student/student';
import { StudentService } from '../../student/student.service';
import { StudentDataService } from '../../student/student-data.service';

@Component({
  selector: 'app-fee-bill',
  templateUrl: './fee-bill.component.html',
  styleUrls: ['./fee-bill.component.css']
})
export class FeeBillComponent implements OnInit {

  showSearchchResults: boolean;
  searchStudents: Student[] = [];
  searchText: string;
  students: Student[];
  selectedStudent: Student;

  constructor(private router: Router,
    private feeBillService: FeeBillService,
    private schoolDataService: SchoolDataService,
    private studentService: StudentService,
    private studentDataService: StudentDataService) { }

  ngOnInit() {
    this.searchText = "";
    this.showSearchchResults = true;
    this.students = this.studentDataService.getStudents();
    if(! this.students || this.students.length === 0){
      this.refreshStudentsList();
    }
  }

  private refreshStudentsList(){
    this.students = []
    let school_key = this.schoolDataService.getSchool().school_id;
    this.studentService.getStudentList(school_key).then(resp => {
      this.students = resp;
      this.studentDataService.setStudents(this.students);
    });
  }

  public getStudentProfilePicURL(profile_image_key, gender){
    let url = '';
    if(profile_image_key){
      url = this.studentService.getProfilePictureUrl(profile_image_key);
    } else if (gender == 'Male') {
      url = 'assets/images/boy.png';
    } else {
      url = 'assets/images/girl.png';
    }
    return url;
  }

  public searchStudent(newValue) {
    this.searchText = newValue;
    this.searchStudents = this.students.filter(function (item) {
      return (item.full_name.toLowerCase().indexOf(newValue.toLowerCase()) > -1 ||
        item.admission_number.toLowerCase().indexOf(newValue.toLowerCase()) > -1);
    });
  }

  showStudentBills(admissionNumber) {
    this.selectedStudent = this.students.filter(function (item) { return item.admission_number == admissionNumber })[0];
    this.showSearchchResults = false;
  }

  showSearch() {
    this.showSearchchResults = true;
  }

}
