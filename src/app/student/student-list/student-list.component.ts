import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Pipe,PipeTransform} from '@angular/core';
import { NotificationsService as AngularNotifications } from 'angular2-notifications' ;

import { StudentInfo } from '../student-info/student-info';
import { Student } from '../student';
import { SchoolStudentData } from '../school-student-data';
import { ContactInfo } from '../../communication/contact-info';

import { StudentsPipe } from './student-filter/students-pipe';
import { StudentService } from '../student.service';
import { StudentFilterDataService } from '../student-filter-data.service';
import { StudentFilter } from './student-filter/student-filter';
import { PersonService } from '../../person/person.service';
import { PersonInfo } from '../../person/person';
import { School } from '../../management/school/school';

import { SchoolDataService } from '../../management/school/school-data.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

  isUpdated: Boolean = false;
  isAdded: Boolean = false;
  sendMsgFlag: boolean = false;
  printFlag: boolean = false;


  studentDetails: String = "";
  sub: any;
  studentList: StudentInfo[] = [];
  students: Student[];
  schoolStudentData: SchoolStudentData;
  student_filter: StudentFilter;
  school:School;

  isStudentSearch : boolean;
  isStudentAdd : boolean;

  public notification_options = {
    position: ["bottom", "right"],
    timeOut: 5000,
    lastOnBottom: true
  };

  constructor(private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private personService: PersonService,
    private schoolDataService: SchoolDataService,
    private studentFilterDataService: StudentFilterDataService,
    private angularNotifications: AngularNotifications
  ) { }

  ngOnInit() {
    this.getStudentList();
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.isUpdated = params['isUpdated'] || false;
        this.isAdded = params['isAdded'] || false;
        this.studentDetails = params['studentDetails'] || "";
      });
    this.student_filter = this.studentFilterDataService.getStudentFilter();
    this.school = this.schoolDataService.getSchool();
  }

  public onStudentFilterChange(student_filter: StudentFilter){
    // Object creation and assignment done instead of direct assignment
    // This is done to trigger change detection in pure Pipe
    // impure pipe is an alternate solution, but it results in larger number of calls
    this.student_filter = new StudentFilter();
    this.student_filter.search_string_elements = student_filter.search_string_elements;
    this.student_filter.search_string = student_filter.search_string;
    this.student_filter.full_name = student_filter.full_name;
    this.student_filter.admission_number = student_filter.admission_number;
    this.student_filter.classes = student_filter.classes;
    this.student_filter.gender = student_filter.gender;
    this.student_filter.divisions = student_filter.divisions;

  }


  public gotoTransport(student_key){
    this.router.navigate(['transport/subscription/' + student_key]);
  }

  private getStudentList(){
    this.studentService.getStudentList(this.schoolDataService.getSchool().school_id).then(resp => {
      this.students = resp;
      this.students.sort(function(a, b) {
          var nameA = a.full_name.toLowerCase(),
              nameB = b.full_name.toLowerCase()
          if (nameA < nameB)
            return -1
          if (nameA > nameB)
            return 1
         })
      })
      .then(()=>{
        this.setStudentList();
      });
  }


  private setStudentList(){
    for(let student of this.students){
      let studentInfo = new StudentInfo();
      studentInfo.student = student;
      let personKey = student.person_key;
      if(personKey){
        this.studentList.push(studentInfo);
      }
    }
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

  public getImageUrl(gender) {
    if (gender && gender.toLowerCase() == 'male') {
      return 'assets/images/boy.png';
    } else {
      return 'assets/images/girl.png';
    }
  }

  public sendMessage() {
    this.sendMsgFlag = true;
  }

  public takePrint() {
    this.printFlag = true;
  }

  public onTakePrint(status: boolean){
    this.printFlag = false;
  }

  public onMessageSent(status: string){
    if(status === 'success'){
      const toast = this.angularNotifications.success('', 'SMS sent', {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: false,
        clickIconToClose: true
      });
      this.sendMsgFlag = false;
    }
    else if(status === 'failed'){
      const toast = this.angularNotifications.error('', 'SMS sending failed', {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: false,
        clickIconToClose: true
      });
      this.sendMsgFlag = true;
    }
    else if(status === 'cancelled'){
      this.sendMsgFlag = false;
    }
  }

  public gotoAddStudent() {
    this.router.navigate(['/student/add']);
  }

  public gotoEditStudent(student_key) {
    this.studentFilterDataService.setStudentFilter(this.student_filter);
    this.router.navigate(['/student/edit',student_key]);
  }

  getContactList(){
    let students_pipe = new StudentsPipe();
    let student_list = students_pipe.transform(this.studentList,this.student_filter);

    let contact_info_list: ContactInfo[] = [];
    for(let info of student_list){
      let contact = new ContactInfo();
      contact.full_name = info.student.full_name;
      contact.contact_key = info.student.student_key;
      contact.gender =(info.person.gender) ? info.person.gender.toString(): null;
      contact.id_code = info.student.admission_number;
      contact.profile_image_url = info.profile_image_url;
      contact.notification_mobile_numbers = info.student.notification_mobile_numbers;
      contact_info_list.push(contact);
    }
    return contact_info_list;
  }
}
