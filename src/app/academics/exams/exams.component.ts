import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StudentFilter } from '../../student/student-list/student-filter/student-filter';
import { StudentInfo } from '../../student/student-info/student-info';
import { Student } from '../../student/student';
import { StudentDataService } from '../../student/student-data.service';
import { StudentService } from '../../student/student.service';
import { SchoolDataService } from '../../management/school/school-data.service';
import { AuditLog } from '../../common/audit-log';
import { UserAccountDataService } from '../../user-account/user-account-data.service';
import { NotificationService } from '../../notification/notification.service';
import * as moment from 'moment';
import { NotificationsService as AngNotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css']
})
export class ExamsComponent implements OnInit {

  constructor(private router: Router,
              private route: ActivatedRoute,)
    { }

  ngOnInit() {
  }

  public gotoAddExam() {
    this.router.navigate(['academics/exams/add']);
  }
}
