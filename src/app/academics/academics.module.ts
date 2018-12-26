import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AccessControlModule } from '../security/access-control/access-control.module';
import { GCCommonModule } from '../common/gccommon.module';
import { StudentModule } from '../student/student.module';

import { AcademicsComponent } from './academics.component';
import { AcademicsRoutingModule } from './academics-routing.module';
import { ClassesComponent } from './classes/classes.component';
import { ClassInfoHttpClient } from './classes/class-info-http-client';
import { ClassInfoService } from './classes/class-info.service';
import { ClassesDataService } from './classes/classes-data.service';
import { PromotionsComponent } from './promotions/promotions.component';
import { AttendenceComponent } from './attendence/attendence.component';
import { AttendanceService } from './attendence/attendance.service';
import { AttendanceHttpClient } from './attendence/attendance-http-client';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';
import { ExamsComponent } from './exams/exams.component';
import { ExamInfoComponent } from './exams/exam-info/exam-info.component';
import { ExamService } from './exams/exam.service';
import { ExamDataService } from './exams/exam-data.service';
import { ExamHttpClient } from './exams/exam-http-client';
// import { SearchExam } from './exams/exam-list/exam-list.component';
import { ExamListComponent, ExamFilter } from './exams/exam-list/exam-list.component';
import { StudentScoreComponent } from './student-score/student-score.component';
import { StudentScoreFilter } from './student-score/student-score.component';
import { StudentScoreService } from './student-score/student-score.service';
import { StudentScoreHttpClient } from './student-score/student-score-http-client';
import { ExamScheduleComponent } from './exams/exam-schedule/exam-schedule.component';
import { ExamMarkingComponent } from './exams/exam-marking/exam-marking.component';
import { NgbDatepickerModule, NgbModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';
import { MarkStudentsComponent } from './exams/mark-students/mark-students.component';
import { ClassReportComponent } from './class-report/class-report.component';
import { ViewDetailedMarklistComponent } from './class-report/view-detailed-marklist/view-detailed-marklist.component';
import { ViewStudentMarkListComponent } from './class-report/view-student-mark-list/view-student-marklist.component';
import { ReportCardConfigurationComponent } from './class-report/report-card-configuration/report-card-configuration.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    SimpleNotificationsModule.forRoot(),
    AccessControlModule,
    AcademicsRoutingModule,
    GCCommonModule,
    StudentModule,
    NgbDatepickerModule.forRoot(),
    NgbModule.forRoot(),
    DlDateTimePickerDateModule,
    NgbTimepickerModule,
  ],
  declarations: [AcademicsComponent, ClassesComponent, PromotionsComponent, AttendenceComponent,
    AttendanceReportComponent, ExamsComponent, ExamInfoComponent, ExamListComponent, ExamScheduleComponent, ExamMarkingComponent,
    StudentScoreComponent, StudentScoreFilter, MarkStudentsComponent, ClassReportComponent, ViewDetailedMarklistComponent, ViewStudentMarkListComponent, ReportCardConfigurationComponent],
  providers: [ExamFilter, ClassInfoHttpClient, ClassInfoService, ClassesDataService, ExamDataService, AttendanceService,
    AttendanceHttpClient, ExamService, ExamHttpClient, StudentScoreService, StudentScoreHttpClient
  ]
})
export class AcademicsModule { }
