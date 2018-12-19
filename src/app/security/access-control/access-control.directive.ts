import { Directive, Input, TemplateRef, ViewContainerRef  } from '@angular/core';
import { UserRoleDataService } from '../../user/user-role/user-role-data.service';


@Directive({
  selector: '[gcAccessControl]'
})
export class AccessControlDirective {

  permissions: string[];

  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              private userRoleDataService: UserRoleDataService) { }


  @Input() set gcAccessControl(access_code: boolean){
    if(!this.permissions){
      this.permissions = this.userRoleDataService.getPermissions();
    }
    if(this.isAccessAllowed(access_code)){
      this.viewContainer.createEmbeddedView(this.templateRef);
    }else{
      this.viewContainer.clear();
    }
  }

  private isAccessAllowed(access_code){
    if(this.permissions && this.permissions.indexOf(access_code)>-1){
      return true;
    }
    else{
      return false;
    }
  }

}
