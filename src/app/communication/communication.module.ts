import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AccessControlModule } from '../security/access-control/access-control.module';
import { GCCommonModule } from '../common/gccommon.module';

import { CommunicationRoutingModule } from './communication-routing.module';
import { CommunicationComponent } from './communication.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    SimpleNotificationsModule.forRoot(),
    CommunicationRoutingModule,
    AccessControlModule,
    GCCommonModule
  ],
  exports: [
    CommunicationComponent
  ],
  declarations: [CommunicationComponent]
})
export class CommunicationModule { }
