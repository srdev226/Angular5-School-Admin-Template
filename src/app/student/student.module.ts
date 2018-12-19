import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AccessControlModule } from '../security/access-control/access-control.module';
import { StudentRoutingModule } from './student-routing.module';
import { GCCommonModule } from '../common/gccommon.module';
import { CommunicationModule } from '../communication/communication.module'

import { StudentComponent } from './student.component';
import { StudentsComponent } from './students/students.component';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentsPipe } from './student-list/student-filter/students-pipe';
import { StudentInfoComponent } from './student-info/student-info.component';
import { StudentProfileComponent } from './student-info/student-profile/student-profile.component';
import { StudentService } from './student.service';
import { StudentDataService } from './student-data.service';
import { StudentFilterDataService } from './student-filter-data.service';
import { StudentFilterComponent } from './student-list/student-filter/student-filter.component';
import { StudentPrintComponent } from './student-list/student-print/student-print.component';
import { AutoEnrollComponent } from './student-info/auto-enroll/auto-enroll.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    SimpleNotificationsModule.forRoot(),
    AccessControlModule,
    GCCommonModule,
    StudentRoutingModule,
    CommunicationModule
  ],
  exports: [
    StudentFilterComponent,
    StudentsPipe,
    StudentsComponent
  ],
  declarations: [StudentComponent, StudentListComponent, StudentsComponent, StudentsPipe, StudentInfoComponent, StudentProfileComponent,
    StudentFilterComponent, AutoEnrollComponent, StudentPrintComponent],
  providers: [StudentService, StudentDataService, StudentFilterDataService]
})

export class StudentModule { }
