import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeeComponent } from './fee.component';
import { FeeBillComponent } from './fee-bill/fee-bill.component';
import { FeeBillListComponent } from './fee-bill/fee-bill-list/fee-bill-list.component';
import { FeeReportComponent } from './fee-report/fee-report.component';

const feeRoutes: Routes = [
  {
    path: 'fee',
    component: FeeComponent,
    children: [
      { path: '', component: FeeBillComponent },
      { path: 'fee-bill', component: FeeBillComponent },
      { path: 'fee-bill/list', component: FeeBillListComponent },
      { path: 'fee-report', component: FeeReportComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(feeRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class FeeRoutingModule { }
