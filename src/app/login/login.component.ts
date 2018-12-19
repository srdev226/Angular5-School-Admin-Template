import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { LoginDetails } from './login-details';
import { LoginResponse } from './login-response';
import { RoleModules } from '../user/user-role/user-role';
import { School } from '../management/school/school';

import { SchoolService } from '../management/school/school.service';
import { SchoolDataService } from '../management/school/school-data.service';
import { LoginService } from './login.service';
import { UserAccountService } from '../user-account/user-account.service';
import { UserAccountDataService } from '../user-account/user-account-data.service';
import { UserRoleService } from '../user/user-role/user-role.service';
import { UserRoleDataService } from '../user/user-role/user-role-data.service';
import { PersonService } from '../person/person.service';
import { ProductService } from '../product/product.service';
import { ProductDataService } from '../product/product-data.service';
import { ClassInfoService } from '../academics/classes/class-info.service';
import { ClassesDataService } from '../academics/classes/classes-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit {

  login_user = new LoginDetails();
  login_response: LoginResponse;
  login_response_success: LoginResponse;
  institutionKey: String;
  institution_id: string = null;
  capsLock: boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private loginService: LoginService,
              private schoolService: SchoolService,
              private schoolDataService: SchoolDataService,
              private userAccountService: UserAccountService,
              private personService: PersonService,
              private userAccountDataService: UserAccountDataService,
              private userRoleService: UserRoleService,
              private userRoleDataService: UserRoleDataService,
              private productService: ProductService,
              private productDataService: ProductDataService,
              private classInfoService: ClassInfoService,
              private classesDataService: ClassesDataService)
  { }

  ngOnInit() {
    this.institution_id = this.route.snapshot.params['institution_id'];
    this.login_user.institutionKey = this.institution_id;
  }

  eventHandler(event) {
    console.log(event, event.keyCode, event.keyIdentifier);
    var s = String.fromCharCode(event.which);
    if (s.toUpperCase() === s && s.toLowerCase() !== s && !event.shiftKey) {
      this.capsLock = true;
    }
  }

  login() {

    this.loginService.login(this.login_user).then(resp => {
          console.log('yes');
          if('Success' == resp.description){
            console.log('[LoginComponent] login success ....');
            this.loginService.validateToken(resp.authKey).then(token_resp=>{
              console.log('[LoginComponent] token validated ....');
              this.userAccountService.getUserAccountDetails(token_resp.accountKey).then(user_account_resp=>{
                console.log('[LoginComponent] user account retrieved ....');
                this.personService.getPerson(user_account_resp.person_key).then(person_resp=>{
                  this.userAccountDataService.setPersonDetails(person_resp);
                  this.userAccountDataService.setUserAccount(user_account_resp);
                  console.log('[LoginComponent] personal details retrieved ....');
                }).then(()=>{
                    let permissions : string[] = [];
                    for(var x=0; x< user_account_resp.user_role_keys.length;x++){
                      this.userRoleService.getUserRoleDetails(user_account_resp.user_role_keys[x]).then(user_service_resp=>{
                        for(var i=0;i<user_service_resp.modules_allowed.length;i++){
                          permissions.push(user_service_resp.modules_allowed[i].module_code);
                          for(var j=0;j<user_service_resp.modules_allowed[i].features_allowed.length;j++){
                            permissions.push(user_service_resp.modules_allowed[i].features_allowed[j]);
                          }
                        }
                      })
                    }
                    this.userRoleDataService.setPermissions(permissions);
                    console.log('[LoginComponent] permissions set ....', permissions);
                }).then( () => {
                  this.classInfoService.getClassInfoList(this.login_user.institutionKey).then(resp => {
                    this.classesDataService.setClasses(resp);
                  });
                  this.schoolService.getSchool(this.login_user.institutionKey).then(resp => {
                       this.schoolDataService.setSchool(resp);
                       this.router.navigate(["/home"]);
                       console.log('[LoginComponent] navigated to home ....');
                  });
                });
              })
            })
            this.setupProductConfig();
          }
          this.login_response = resp;
        }
      );

  }

  private setupProductConfig() {
    this.productService.getMasterProduct().then(resp => {
      this.productDataService.setMasterProduct(resp);
    });
    this.productService.getProduct().then(resp => {
      this.productDataService.setProduct(resp);
    });
  }

  onSubmit() {
    this.login();
  }

}
