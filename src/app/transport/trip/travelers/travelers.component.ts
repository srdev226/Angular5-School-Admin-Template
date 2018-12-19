import { Component, OnInit, Input } from '@angular/core';
import { Trip, Stop as TripStop } from '../trip';
import { SubscriptionService } from '../../subscription/subscription.service';
import { StudentDataService } from '../../../student/student-data.service';
import { StudentService } from '../../../student/student.service';
import { SchoolDataService } from '../../../management/school/school-data.service';
import { StudentInfo } from '../../../student/student-info/student-info';
import { ContactInfo } from '../../../communication/contact-info';
import * as moment from 'moment';
import { NotificationsService as AngularNotifications } from 'angular2-notifications' ;
import { Student } from '../../../student/student';
import { School } from '../../../management/school/school';

@Component({
  selector: 'app-travelers',
  templateUrl: './travelers.component.html',
  styleUrls: ['./travelers.component.css']
})
export class TravelersComponent implements OnInit {

  _trip: Trip;

  students: Student[];
  studentlist: any[];
  school: School;
  stop_code: string[]
  studentList: StudentInfo[] = [];
  todays_date: string;
  sendMsgFlag: boolean = false;
  printFlag: boolean = false;
  listFlag: boolean = false;

  public notification_options = {
    position: ["bottom", "right"],
    timeOut: 5000,
    lastOnBottom: true
  };

  constructor(private subscriptionService: SubscriptionService,
              private studentDataService: StudentDataService,
              private studentService: StudentService,
              private angularNotifications: AngularNotifications,
              private schoolDataService: SchoolDataService) { }

  ngOnInit() {
    this.todays_date = moment().format('DD/MM/YYYY');
    this.school = this.schoolDataService.getSchool();
    if(!this.studentDataService.getStudents()){
      this.studentService.getStudentList(this.schoolDataService.getSchool().school_id).then(resp => {
        this.studentDataService.setStudents(resp);
        this.setTripStudents();
      })
    }else{
      this.setTripStudents();
    }

  }

  private setTripStudents(){
    console.log('[TravelersComponent] setting students for trip ...' + this.trip.trip_key);
    if(! this.trip || ! this.studentDataService.getStudents()){
      return;
    }
    this.subscriptionService.getSubscriptionsByService(this.trip.trip_key).then(resp => {
      let subscriptions = resp;
      this.students = [];
      this.studentlist = [];
      subscriptions = subscriptions.filter(x =>x.subscription_periods.find(x => x.from_date.split("/")[1] === this.todays_date.split("/")[1] &&
                                                                                x.from_date.split("/")[2] === this.todays_date.split("/")[2]));
      for(let subscription of subscriptions){
        let student_stop : any = {};
        student_stop.student =  this.studentDataService.getStudents().find(x => x.student_key === subscription.subscriber_key);
        this.students.push(student_stop.student);
        student_stop.stop = subscription.trip.stop_code;
        this.studentlist.push(student_stop);
      }
    });
  }

  getStopName(code: string){
    let stop = this.trip.stops.find(x => x.stop_code === code);
    if(stop){
      return stop.name;
    }
  }

  @Input()
  set trip(trip: Trip) {
    this._trip = trip;
    this.setTripStudents();
  }

  get trip(): Trip {
    return this._trip;
  }

  public sendMessage() {
    this.sendMsgFlag = true;
  }

  public listview(){
    this.listFlag = true
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

  getContactList(){
    let students_pipe = new StudentInfo();
    let student_list = this.students;
    let contact_info_list: ContactInfo[] = [];
    for(let info of student_list){
      let contact = new ContactInfo();
      contact.full_name = info.full_name;
      contact.contact_key = info.student_key;
      contact.gender =(info.gender) ? info.gender.toString(): null;
      contact.id_code = info.admission_number;
      contact.profile_image_url = students_pipe.profile_image_url;
      contact.notification_mobile_numbers = info.notification_mobile_numbers;
      contact_info_list.push(contact);
    }
    return contact_info_list;
  }

  public downloadCsv(csv, student) {
    var csvFile;
    var downloadLink;
    csvFile = new Blob([csv], {type: "text/csv"});
    downloadLink = document.createElement("a");
    downloadLink.download = student;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  public export_table_to_csv(student) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");
    for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll("td, th");
      for (var j = 0; j < cols.length; j++)
      row.push(cols[j].textContent);
      csv.push(row.join(","));
    }
    this.downloadCsv(csv.join("\n"), student);
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print_div').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          table {
               font-family: arial, sans-serif;
               border-collapse: collapse;
               width: 100%;
               font-size: 70%;
          }
          td, th{
              border: 1px solid #424242;
              text-align: left;
              padding: 8px;
          }
          .value{
             border-top: 2px solid black;
          }
          .align{
              text-align: center;
          }
          .table{
            width:100%;
            font-size:12px;
          }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

}
