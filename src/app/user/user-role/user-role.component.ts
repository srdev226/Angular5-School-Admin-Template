import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Product } from '../../product/product';
import { UserRole, RoleModules } from './user-role';

import { UserRoleService } from './user-role.service';
import { ProductService } from '../../product/product.service';
import { SchoolService } from '../../management/school/school.service';
import { SchoolDataService } from '../../management/school/school-data.service';
import { NotificationsService } from 'angular2-notifications' ;

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.css']
})
export class UserRoleComponent implements OnInit {

  user_role : UserRole = new UserRole();
  role_modules : RoleModules[] = [];
  product : Product;

  public options = {
      position: ["bottom", "right"],
      timeOut: 5000,
      lastOnBottom: true
    };

  constructor(private route: ActivatedRoute,
              private router: Router,
              private productService : ProductService,
              private userRoleService : UserRoleService,
              private schoolDataService : SchoolDataService,
              private schoolService : SchoolService,
              private notificationsService: NotificationsService,
  ) { }

  ngOnInit() {
    this.user_role.user_role_key = this.route.snapshot.params['user_role_key'];
    if(this.user_role.user_role_key){
      this.setUserRoleDetails();
    }
    this.getModulesAndFeatureList();
  }

  setUserRoleDetails(){
      this.userRoleService.getUserRoleDetails(this.user_role.user_role_key).then(resp=>{
        this.user_role = resp;
        this.role_modules = resp.modules_allowed;
      })
  }

  getModulesAndFeatureList(){
    this.productService.getProduct().then(resp => {
      this.product = resp;
    })
  }

  addOrUpdateUserRole(){
    this.user_role.institution_key = this.schoolDataService.getSchool().school_id;
    this.user_role.modules_allowed = this.role_modules;
    if(this.user_role.user_role_key){
      this.updateUserRole();
    }
    else{
      this.addUserRole();
    }
  }

  updateUserRole(){
    this.userRoleService.updateUserRole(this.user_role).then(resp=>{
      console.log('.... user role updated...'+resp.user_role_key);
      let school = this.schoolDataService.getSchool();
      school.product_configuration.user_roles.push(resp.user_role_key);
      this.schoolService.updateSchool(school).then(school_resp => {
        console.log('School user role collection updated...');
        const toast = this.notificationsService.success('Success', 'User role updated', {
          timeOut: 5000,
          showProgressBar: true,
          pauseOnHover: true,
          clickToClose: false,
          clickIconToClose: true
        });
      });
      this.goToUserRoleList();
    });
  }

  addUserRole(){
    this.userRoleService.addUserRole(this.user_role).then(resp=>{
      console.log('.... user role added...'+resp.user_role_key);
      let school = this.schoolDataService.getSchool();
      school.product_configuration.user_roles.push(resp.user_role_key);
      this.schoolService.updateSchool(school).then(school_resp => {
        console.log('School user role collection updated...');
        const toast = this.notificationsService.success('Success', 'User role added', {
          timeOut: 5000,
          showProgressBar: true,
          pauseOnHover: true,
          clickToClose: false,
          clickIconToClose: true
        });
      });
      this.goToUserRoleList();
    });
  }

  public addOrRemoveModule(module_code){
    let index = this.role_modules.findIndex( x => x.module_code === module_code);
    if(index > -1){
      this.role_modules.splice(index, 1);
    }else{
      let module : RoleModules = new RoleModules();
      module.module_code = module_code;
      module.features_allowed = [];
      this.role_modules.push(module);
    }
  }

  public addOrRemoveFeature(module_code,feature){
    let module = this.role_modules.filter( x => x.module_code === module_code)[0];
    if(!module){
      module = new RoleModules();
      module.module_code = module_code;
      module.features_allowed = [];
      this.role_modules.push(module);
    }
    if(module){
      let index = module.features_allowed.findIndex(x => x === feature);
      if(index > -1){
        module.features_allowed.splice(index, 1);
        if(module.features_allowed.length < 1){
          let m_index = this.role_modules.findIndex( x => x.module_code === module_code);
          this.role_modules.splice(m_index, 1);
        }
      }
      else{
        module.features_allowed.push(feature);
      }
    }
  }

  getModuleFeatures(module_code){
      let feature_list = this.product.modules.find( x => x.code === module_code).features_list;
      return feature_list;
  }

  public isModuleSelected(module_code){
    let index = this.role_modules.findIndex( x => x.module_code === module_code);
    if(index > -1){
      return true;
    }else{
      return false;
    }
  }

  public isFeatureSelected(module_code,feature){
    let module = this.role_modules.filter( x => x.module_code === module_code)[0];
    if(module){
      let index = module.features_allowed.findIndex(x => x === feature);
      if(index > -1){
        return true;
      }else{
        return false;
      }
    }
    else{
      return false;
    }
  }

  goToUserRoleList(){
    this.router.navigate(['user/user_role']);
  }
}
