import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { UserComponent } from './user.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserRoleComponent } from './user-role/user-role.component';
import { UserRoleListComponent} from './user-role-list/user-role-list.component';

const routes: Routes = [{
  path: 'user',
     component: UserComponent,
     children: [
         { path: '', component: UserListComponent},
         { path: 'list', component: UserListComponent},
         { path: 'add', component: UserInfoComponent},
         { path: 'edit/:accountKey', component: UserInfoComponent},
         { path: 'user_role', component: UserRoleListComponent},
         { path: 'user_role/add', component: UserRoleComponent},
         { path: 'user_role/edit/:user_role_key', component: UserRoleComponent}
     ]
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class UserRoutingModule { }
