import { Component, OnInit } from '@angular/core';
import { StudentFilter } from '../../student/student-list/student-filter/student-filter';
import { StudentInfo } from '../../student/student-info/student-info';
import { Student } from '../../student/student';
import { StudentDataService } from '../../student/student-data.service';
import { StudentService } from '../../student/student.service';
import { SchoolDataService } from '../../management/school/school-data.service';
import { Attendance } from './attendance';
import { AttendanceService } from './attendance.service';
import { AuditLog } from '../../common/audit-log';
import { UserAccountDataService } from '../../user-account/user-account-data.service';
import { NotificationService } from '../../notification/notification.service';
import * as moment from 'moment';
import { NotificationsService as AngNotificationsService } from 'angular2-notifications';
import { Messaging} from '../../messaging/messaging';
import { MessagingService } from '../../messaging/messaging.service';


@Component({
  selector: 'app-attendence',
  templateUrl: './attendence.component.html',
  styleUrls: ['./attendence.component.css']
})
export class AttendenceComponent implements OnInit {

  student_filter: StudentFilter;

  studentInfoList: StudentInfo[] = [];
  absenteeList: StudentInfo[] = [];
  attendence_date: string;
  send_sms_flag = true;
  messaging: Messaging;


  public notification_options = {
    position: ["bottom", "right"],
    timeOut: 5000,
    lastOnBottom: true
  };

  constructor(private studentDataService: StudentDataService,
              private schoolDataService: SchoolDataService,
              private studentService: StudentService,
              private attendanceService: AttendanceService,
              private messagingService: MessagingService,
              private userAccountDataService: UserAccountDataService,
              private notificationService: NotificationService,
              private angNotificationsService: AngNotificationsService) { }

  ngOnInit() {
    this.student_filter = new StudentFilter();
    this.setStudentList();
    this.attendence_date = moment().format('DD/MM/YYYY');
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

  public selectUnSelectStudent(student){
    student.selected = !student.selected;
    if(student.selected){
      this.absenteeList.push(student);
    }else{
      let _student = this.absenteeList.find( x=> x.student.student_key === student.student.student_key)
      if (_student){
        let index = this.absenteeList.indexOf(_student);
        this.absenteeList.splice(index, 1);
      }
    }
  }

  public markAttendence(){
    let responses = [];
    for(let _student of this.absenteeList){
      let attResp = this.attendanceService.addAttendance(this.getAttendence(_student.student)).then(resp => {
        console.log('[AttendenceComponent] attendance added ', _student.student.full_name);
        if(this.send_sms_flag){
          this.sendSMSNotification(_student.student);
        }else{
          console.warn('SMS message for attendance not sent as flagged');
        }
      }).catch( x => {
          console.error('[AttendenceComponent] attendence could not be added')
      });
      responses.push(attResp);
    }
    Promise.all(responses).then( x => {
      this.showNotification("Success","Attendance marked for " + (this.absenteeList ? this.absenteeList.length : 0) + " students");
      this.absenteeList = [];
    }).catch( x => {
      this.showErrorNotification("Error", "One or more of attendance marking failed");
    });
  }

  private sendSMSNotification(_student){
    this.sendMessage(_student);
    let msg = this.getFormattedSchoolName() + _student.full_name + ', ' + _student.current_class + ' ' + _student.division + ' is absent from class on '+
              moment(this.attendence_date, 'DD/MM/YYYY').format('ll');

    if(_student.notification_mobile_numbers && _student.notification_mobile_numbers.length > 0){
      let mob_number = _student.notification_mobile_numbers[0].country_code + _student.notification_mobile_numbers[0].phone_number;
      let resp = this.notificationService.sendSMSMessage(msg, mob_number).then(resp => {
        console.log('[AttendenceComponent] SMS sent ',mob_number);
      }).catch( x=> {
        console.error('[AttendenceComponent] Message could not be sent. Server error');
      });
    }else{
      console.warn('[AttendenceComponent] SMS could not be sent. Notification number not available');
    }
  }

  private sendMessage(_student){
    console.log('[AttendenceComponent] Semting web sent ');
    let messaging = new Messaging();
    let message =  _student.full_name + ', ' + _student.current_class + ' ' + _student.division + ' is absent from class on '+
              moment(this.attendence_date, 'DD/MM/YYYY').format('ll');
    messaging.title = "Attendence Notification";
    messaging.time_stamp = moment().format();
    messaging.message = message;
    messaging.sender_key = this.schoolDataService.getSchool().school_id;
    messaging.sender_type = "SCHOOL";
    messaging.receiver_key = _student.student_key;
    messaging.receiver_type = "STUDENT";
    messaging.thread_key = "thread_key";

    this.messagingService.addMessage(messaging).then(resp => {
        messaging.message_key = resp.message_key;
        console.log('[FeeBillListComponent] FeePayment app notification - message - ', messaging.message, ' title ', messaging.title, 'student_key', messaging.receiver_key);
    }).catch(resp => {
        this.showErrorNotification("Message Not send", "Server Error");
    })
    this.messaging = messaging;
  }

  private getFormattedSchoolName(){
    let school_name = this.schoolDataService.getSchool().name;
    school_name = school_name.length > 27 ? school_name.substring(0,27) : school_name;
    return "[" + school_name + "] ";
  }

  private getAttendence(_student){
    let attendance = new Attendance();
    attendance.attendance_date = this.getISODate(this.attendence_date);
    attendance.class_key = _student.current_class_key;
    attendance.division = _student.division;
    attendance.school_key = _student.school_id;
    attendance.student_key = _student.student_key;
    attendance.reason = "Not specified";
    attendance.audit_logs = [];
    let audit_log = new AuditLog();
    audit_log.log_date = moment().format();
    audit_log.message = "Absence marked by " + this.userAccountDataService.getPersonDetails().full_name;
    audit_log.user_name = this.userAccountDataService.getPersonDetails().full_name;
    attendance.audit_logs.push(audit_log);
    return attendance;
  }


  private getISODate(str_date){
    return moment(str_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
  }

  private setStudentList(){
    if(! this.studentDataService.getStudents()){
      console.log('[AttendenceComponent] loading students ...');
      this.studentService.getStudentList(this.schoolDataService.getSchool().school_id).then(resp => {
        this.studentDataService.setStudents(resp);
        this.setStudentInfoList();
      })
    }else{
      console.log('[AttendenceComponent] students list present ...')
      this.setStudentInfoList();
    }
  }

  private setStudentInfoList(){
    for(let student of this.studentDataService.getStudents()){
      let studentInfo = new StudentInfo();
      studentInfo.student = student;
      let personKey = student.person_key;
      if(personKey){
        this.studentInfoList.push(studentInfo);
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
