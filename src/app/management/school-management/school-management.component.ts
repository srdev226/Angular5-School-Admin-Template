import { Component, OnInit } from '@angular/core';

import { SchoolManagement } from './school-management';
import { School } from '../../management/school/school';

import { SchoolManagementService } from './school-management.service';
import { SchoolDataService } from '../../management/school/school-data.service';
import { SchoolService } from '../school/school.service';

@Component({
  selector: 'app-school-management',
  templateUrl: './school-management.component.html',
  styleUrls: ['./school-management.component.css']
})
export class SchoolManagementComponent implements OnInit {

  isEditing: boolean;
  school_management : SchoolManagement = new SchoolManagement();

  constructor(private schoolManagementService: SchoolManagementService,
              private schoolDataService: SchoolDataService,
              private schoolService: SchoolService
    ) { }

  ngOnInit() {
    this.isEditing = false;
    this.setManagement();
  }

  setManagement(){
    let school = this.schoolDataService.getSchool();
    if(school.school_information.school_management_key){
    this.schoolManagementService.getManagement(school.school_information.school_management_key)
      .then(resp=>{
          this.school_management = resp;
      });
    }
  }

  addOrUpdate(){
    if(this.school_management.school_management_key){
      this.updateManagement();
    }
    else{
      this.addManagement();
    }
  }

  addManagement(){

    this.schoolManagementService.addManagement(this.school_management)
      .then(resp=>{
        this.school_management.school_management_key = resp.school_management_key;

        let school : School = this.schoolDataService.getSchool();
        school.school_information.school_management_key = resp.school_management_key;
        this.schoolService.updateSchool(school);
        this.schoolDataService.setSchool(school);

        console.log('School Management added '+resp.school_management_key);
      });
      this.isEditing = false;
  }

  updateManagement(){

    this.schoolManagementService.updateManagement(this.school_management)
      .then(resp=>{
        console.log('School Management updated');
      });
      this.isEditing = false;
  }
}
