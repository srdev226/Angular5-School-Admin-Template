import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { StudentComponent } from './student/student.component';
import { StudentInfoComponent } from './student/student-info/student-info.component';
import { StudentListComponent } from './student/student-list/student-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApplicationListComponent } from './application-list/application-list.component';
import { PaymentComponent } from './payment/payment.component';

const appRoutes: Routes = [{
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'home', component: DashboardComponent },
  { path: 'login/:institution_id', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'applications', component: ApplicationListComponent },
  { path: 'payments', component: PaymentComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
