import { Component, OnInit } from '@angular/core';

import { Attendance } from '../attendence/attendance';
import { Student } from '../../student/student';
import { StudentInfo } from '../../student/student-info/student-info';
import { ClassInfo } from '../classes/class-info';

import { StudentDataService } from '../../student/student-data.service';
import { SchoolDataService } from '../../management/school/school-data.service';
import { UserAccountDataService } from '../../user-account/user-account-data.service';
import { ClassesDataService } from '../classes/classes-data.service';

import { StudentService } from '../../student/student.service';
import { AttendanceService } from '../attendence/attendance.service';
import { NotificationService } from '../../notification/notification.service';
import * as moment from 'moment';
import { NotificationsService as AngNotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.css']
})
export class AttendanceReportComponent implements OnInit {

  classes: any[];
  absentee_list: Attendance[];
  student_list: StudentInfo[] = [];
  filtered_student_list: StudentInfo[] = [];
  list: AbsentDetail[];
  attendance_date: string;
  select_date: any;
  todays_date: any;
  is_details_loaded: boolean = false;

  public notification_options = {
    position: ["bottom", "right"],
    timeOut: 5000,
    lastOnBottom: true
  };

  constructor(private studentDataService: StudentDataService,
              private schoolDataService: SchoolDataService,
              private studentService: StudentService,
              private attendanceService: AttendanceService,
              private userAccountDataService: UserAccountDataService,
              private classesDataService: ClassesDataService,
              private notificationService: NotificationService,
              private angNotificationsService: AngNotificationsService) { }

  ngOnInit() {
    this.todays_date = moment().format('DD-MM-YYYY');
    this.setStudentList();
  }

  private groupByClasses(){
    let class_info_list: ClassInfo[] = [];
    this.list = [];
    this.classes = this.classes.filter((x,i,a) => x && a.indexOf(x) === i);
    for(let cls of this.classes){
      class_info_list.push(this.classesDataService.getClasses().find(x => x.class_info_key === cls));
    }

    class_info_list.sort(function(a,b){return (a.order_index) - (b.order_index)});

    for(let info of class_info_list){
      let detail = new AbsentDetail();
      detail.student_list = this.filtered_student_list.filter(x => x.student.current_class_key === info.class_info_key);
      detail.class_key = info.class_info_key.toString();
      detail.class_code = detail.student_list[0].student.current_class;
      detail.division = detail.student_list[0].student.division;
      this.list.push(detail);
    }
  }

  private setStudentList(){
    if(! this.studentDataService.getStudents()){
      console.log('[AbsenteeReportComponent] loading students ...');
      this.studentService.getStudentList(this.schoolDataService.getSchool().school_id).then(resp => {
        this.studentDataService.setStudents(resp);
        this.setStudentInfoList();
      })
    }else{
      console.log('[AbsenteeReportComponent] students list present ...')
      this.setStudentInfoList();
    }
  }

  private setStudentInfoList(){
    this.student_list = [];
    let school_id = this.schoolDataService.getSchool().school_id;
    let absent_Param = new Attendance();
      absent_Param.school_key = school_id;
       if(!this.select_date){
        this.select_date = this.todays_date;
    }
    var a = this.select_date.split("-")[2];
    var b = this.select_date.split("-")[1];
    var c = this.select_date.split("-")[0];
    let select_date = a+"-"+b+"-"+c;
     absent_Param.attendance_date = select_date;
      this.attendanceService.getAttendanceByDate(absent_Param).then( resp => {
       this.absentee_list = resp;
        for(let info of this.absentee_list){
        let student_info : StudentInfo = new StudentInfo();
        if(info.student_key){
          student_info.student = this.studentDataService.getStudents().find(x => x.student_key === info.student_key);
          if(student_info.student && student_info.student.person_key)
          {
            if(!student_info.student.profile_image_key){
              student_info.profile_image_url = this.getImageUrl(student_info.student.gender);
            }else{
              this.studentService.getProfilePicture(student_info.student.profile_image_key).then(image_response=>{
                student_info.profile_image_url = image_response.url;
              });
            }
            this.student_list.push(student_info);
          }
        }
      }
      this.is_details_loaded = true;
      this.filterStudents();
    });
  }

  filterStudents(){
    this.classes = [];
    this.filtered_student_list = [];
    for(let info of this.absentee_list){
      let student_info = this.student_list.find(x => x.student.student_key === info.student_key);
      this.filtered_student_list.push(student_info);
      this.classes.push(info.class_key);
    }
    this.groupByClasses();
  }

  private getImageUrl(gender) {
    if (gender && gender.toLowerCase() == 'male') {
      return 'assets/images/boy.png';
    } else {
      return 'assets/images/girl.png';
    }
  }

  private showNotification(msg_type, message){
    const toast = this.angNotificationsService.success(msg_type, message, {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

  private showErrorNotification(msg_type, message){
    const toast = this.angNotificationsService.error(msg_type, message, {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: false,
      clickIconToClose: true
    });
  }
}

export class AbsentDetail{
  class_key: string;
  class_code: string;
  division: string;
  student_list: StudentInfo[];
}
