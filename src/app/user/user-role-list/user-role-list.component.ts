import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { School } from '../../management/school/school';
import { UserRole } from '../../user/user-role/user-role';

import { SchoolDataService } from '../../management/school/school-data.service';
import { UserRoleService } from '../../user/user-role/user-role.service';

@Component({
  selector: 'app-user-role-list',
  templateUrl: './user-role-list.component.html',
  styleUrls: ['./user-role-list.component.css']
})
export class UserRoleListComponent implements OnInit {

  user_roles : UserRole[] = [];

  constructor(private router: Router,
              private schoolDataService: SchoolDataService,
              private userRoleService: UserRoleService
  ) { }

  ngOnInit() {
    this.getUserRoleDetails();
  }

  getUserRoleDetails(){
    let school = this.schoolDataService.getSchool();
    let user_role_keys = school.product_configuration.user_roles;
    console.log('User role keys......'+user_role_keys);
    for(let key of user_role_keys){
      if(key){
        this.userRoleService.getUserRoleDetails(key).then(resp=>{
          this.user_roles.push(resp);
        });
      }
    }
  }

  goToEditUserRole(user_role_key){
    this.router.navigate(['user/user_role/edit',user_role_key]);
  }

  gotoAddUserRole() {
    this.router.navigate(['user/user_role/add']);
  }
}
