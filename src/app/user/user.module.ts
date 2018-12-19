import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AccessControlModule } from '../security/access-control/access-control.module';
import { GCCommonModule } from '../common/gccommon.module';
import { UserRoutingModule } from './user-routing.module';

import { UserComponent } from './user.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserRoleComponent } from './user-role/user-role.component';
import { UserRoleListComponent} from './user-role-list/user-role-list.component';
import { UserRoleDataService } from './user-role/user-role-data.service';
import { UserRoleService} from './user-role/user-role.service';

@NgModule({
   imports: [
     CommonModule,
     BrowserModule,
     FormsModule,
     SimpleNotificationsModule.forRoot(),
     AccessControlModule,
     GCCommonModule,
     UserRoutingModule
   ],
   declarations: [
     UserComponent,
     UserListComponent,
     UserInfoComponent,
     UserRoleComponent,
     UserRoleListComponent
   ],
   providers: [UserRoleService, UserRoleDataService]
 })
 export class UserModule { }
