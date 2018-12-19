import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User} from '../user';
import { UserRole} from '../user-role/user-role';
import { UserAccount} from '../../user-account/user-account';
import { PersonInfo} from '../../person/person';
import { School } from '../../management/school/school';

import { UserRoleService} from '../user-role/user-role.service';
import { UserAccountService} from '../../user-account/user-account.service';
import { SchoolDataService } from '../../management/school/school-data.service';
import { PersonService} from '../../person/person.service';
import { LoginService } from '../../login/login.service';
import { LoginDetails } from '../../login/login-details';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})

export class UserInfoComponent implements OnInit {

  isEditing: boolean = false;

  user: User =  new User();
  user_account = new UserAccount();
  user_roles : UserRole[] = [];
  school : School = new School();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userAccountService: UserAccountService,
              private schoolDataService: SchoolDataService,
              private personService: PersonService,
              private userRoleService: UserRoleService,
              private loginService: LoginService
            ) { }

  ngOnInit() {
    this.user_account.user_account_key = this.route.snapshot.params['accountKey'];
    this.user.accountKey = this.user_account.user_account_key;
    this.school = this.schoolDataService.getSchool();
    if(this.school.product_configuration && this.school.product_configuration.user_roles){
      let user_role_keys = this.school.product_configuration.user_roles;
      for(let key of user_role_keys){
        this.userRoleService.getUserRoleDetails(key).then(resp=>{
          let user_role = resp;
          user_role.institution_key = this.school.school_id;
          user_role.user_role_key = key;
          user_role.role_name = resp.role_name;
          this.user_roles.push(user_role);
        });
      }
    }
    if(this.user.accountKey !== null && this.user.accountKey !== undefined){
      this.isEditing = true;
      this.setUserDetails();
    }
  }

  setUserDetails(){
      this.userAccountService.getUserAccountDetails(this.user.accountKey).then(resp=>{
        this.user_account = resp;
      }).then(()=>{
        this.personService.getPerson(this.user_account.person_key).then(person_resp=>{
          this.user.full_name = person_resp.full_name;
        })
      })
  }

  addOrUpdateUser(){
    if(this.user_account.user_account_key){
      this.updateUser();
    }
    else{
      this.addUser();
    }
  }

  addUser(){
    let school_key = this.school.school_id;
    let person : PersonInfo = new PersonInfo();
    person.full_name = this.user.full_name;

    this.user.institutionKey = school_key;

    this.userAccountService.addUserAccount(this.user_account)
        .then(resp=>{
              this.user.accountKey = resp.user_account_key;
              this.user_account.user_account_key = resp.user_account_key;
              this.registerAuthenticationUser(this.user);
              this.personService.addPerson(person).then(resp=>{
                  this.user_account.person_key = resp.person_key;
                  this.user_account.school_key = school_key;
              }).then(()=>{
                this.userAccountService.updateUserAccount(this.user_account);
              }
            );
        });

    this.goToUserList();
  }

  updateUser(){
    this.personService.getPerson(this.user_account.person_key).then( resp => {
      let person = resp;
      person.full_name = this.user.full_name;
      this.personService.updatePerson(person).then( person_resp => {
        this.userAccountService.updateUserAccount(this.user_account);
      })
    });
    this.goToUserList();
  }

  private registerAuthenticationUser(user: User){
    let loginInfo: LoginDetails = new LoginDetails();
    loginInfo.institutionKey = user.institutionKey;
    loginInfo.username = user.username;
    loginInfo.password = user.password;
    this.loginService.registerAdminUser(user.accountKey, loginInfo).then(resp => {
      ;
    });
  }

  goToUserList() {
      this.router.navigate(['user/list']);
  }
}
