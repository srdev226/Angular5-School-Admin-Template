import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AccessControlModule } from '../security/access-control/access-control.module';
import { GCCommonModule } from '../common/gccommon.module';
import { CommunicationModule } from '../communication/communication.module';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeeInfoComponent } from './employee-info/employee-info.component';
import { EmployeeListComponent, SearchEmployee } from './employee-list/employee-list.component';
import { EmployeesComponent } from './employees.component';
import { EmployeeService } from './employee.service';
import { EmployeeHttpClient} from './employee-http-client';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    SimpleNotificationsModule.forRoot(),
    AccessControlModule,
    GCCommonModule,
    CommunicationModule,
    EmployeesRoutingModule
  ],
  declarations: [
    EmployeeInfoComponent,
    EmployeeListComponent,
    EmployeesComponent,
    SearchEmployee
  ],
  providers: [EmployeeService, EmployeeHttpClient]
})
export class EmployeesModule { }
