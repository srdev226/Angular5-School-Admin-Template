import { Injectable } from '@angular/core';

@Injectable()
export class UserRoleDataService {

  permissions : string[] = [];

  constructor() { }

  setPermissions(permissions : string[]){
    this.permissions = permissions;
  }

  getPermissions(){
    return this.permissions;
  }

}
