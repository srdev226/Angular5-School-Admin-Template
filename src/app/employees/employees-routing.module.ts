import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { EmployeesComponent} from './employees.component';
import { EmployeeInfoComponent} from './employee-info/employee-info.component';
import { EmployeeListComponent} from './employee-list/employee-list.component';

const routes: Routes = [{
    path: 'employee',
    component: EmployeesComponent,
    children: [
        { path: '', component: EmployeeListComponent },
        { path: 'add', component: EmployeeInfoComponent },
        { path: 'edit/:employee_key', component: EmployeeInfoComponent },
        { path: 'list', component: EmployeeListComponent }
    ]
}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: []
})

export class EmployeesRoutingModule {
OnInit(){}
}
