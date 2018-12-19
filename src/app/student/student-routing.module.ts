import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student.component'
import { StudentListComponent } from './student-list/student-list.component'
import { StudentInfoComponent } from './student-info/student-info.component';
import { CommunicationComponent } from '../communication/communication.component';

const appRoutes: Routes = [{
    path: 'student',
    component: StudentComponent,
    children: [
        { path: '', component: StudentListComponent },
        { path: 'list', component: StudentListComponent },
        { path: 'add', component: StudentInfoComponent },
        { path: 'edit/:student_key', component: StudentInfoComponent },
        { path: 'communication', component: CommunicationComponent }
    ]
}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})

export class StudentRoutingModule { }
