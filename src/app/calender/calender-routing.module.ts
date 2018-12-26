import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalenderComponent } from './calender.component';

const calenderRoutes: Routes = [
  {
    path: 'calender',
    component: CalenderComponent,
    children: [
      { path: '', component: CalenderComponent},
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(calenderRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CalenderRoutingModule { }
