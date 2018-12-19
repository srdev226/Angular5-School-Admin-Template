import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AcademicsComponent } from './academics.component';
import { AttendenceComponent } from './attendence/attendence.component';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';
import { ClassesComponent } from './classes/classes.component';
import { PromotionsComponent } from './promotions/promotions.component';
import { ExamsComponent } from './exams/exams.component';
import { ExamInfoComponent } from './exams/exam-info/exam-info.component';
import { ExamListComponent } from './exams/exam-list/exam-list.component';
import { ExamScheduleComponent } from './exams/exam-schedule/exam-schedule.component';
import { ExamMarkingComponent } from './exams/exam-marking/exam-marking.component';
import { StudentScoreComponent } from './student-score/student-score.component';
import { MarkStudentsComponent } from './exams/mark-students/mark-students.component'
import { ClassReportComponent } from './class-report/class-report.component'

const appRoutes: Routes = [{
    path: 'academics',
    component: AcademicsComponent,
    children: [
        { path: '', component: ClassesComponent },
        { path: 'classes', component: ClassesComponent },
        { path: 'promotions', component: PromotionsComponent },
        { path: 'attendence', component: AttendenceComponent },
        { path: 'attendance-report', component: AttendanceReportComponent },
        { path: 'exams', component: ExamsComponent },
        { path: 'exams/schedule/:exam_code/:academic_year', component: ExamScheduleComponent },
        { path: 'exams/marking/:exam_code/:academic_year', component: ExamMarkingComponent },
        { path: 'exams/mark_std', component: MarkStudentsComponent },
        { path: 'exams/add', component: ExamInfoComponent },
        { path: 'exams/edit/:exam_key', component: ExamInfoComponent },
        { path: 'student_score', component: StudentScoreComponent },
        { path: 'class_report', component: ClassReportComponent},
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

export class AcademicsRoutingModule { }
