import { Component, OnInit } from '@angular/core';
import { InstitutionService } from './institution.service';
import { Institution } from './institution';

import { SchoolDataService } from '../school/school-data.service';

@Component({
  selector: 'app-institution',
  templateUrl: './institution.component.html',
  styleUrls: ['./institution.component.css']
})
export class InstitutionComponent implements OnInit {

  institutions: Institution[];
  school_management_key:string;

  constructor(private institutionService: InstitutionService,
              private schoolDataService: SchoolDataService
  ) { }

  ngOnInit() {
    let school = this.schoolDataService.getSchool();
    this.school_management_key = school.school_information.school_management_key;
    this.setInstitutions();
  }

  private setInstitutions(){
    this.institutionService.getInstituitionList(this.school_management_key).then(resp => {
      this.institutions = resp;
    });
  }

  public addRow() {
    if(!this.institutions){
      this.institutions = [];
    }
    this.institutions.push(this.getNewInstitution());
  }

  private getNewInstitution(): Institution{
    let inst: Institution = new Institution();
    inst.school_management_key = this.school_management_key;
    return inst;
  }

}
