import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessControlDirective } from './access-control.directive'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AccessControlDirective],
  exports: [AccessControlDirective]
})
export class AccessControlModule { }
