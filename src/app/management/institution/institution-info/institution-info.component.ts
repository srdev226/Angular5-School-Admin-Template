import { Component, OnInit, Input } from '@angular/core';

import { Institution } from '../institution'
import { InstitutionService } from '../institution.service'
import { SchoolDataService } from '../../school/school-data.service';

@Component({
  selector: 'app-institution-info',
  templateUrl: './institution-info.component.html',
  styleUrls: ['./institution-info.component.css']
})
export class InstitutionInfoComponent implements OnInit {

  @Input()
  institution: Institution;

  isEditing: boolean;
  message : string;

  constructor(private institutionService: InstitutionService,
              private schoolDataService: SchoolDataService
  ) { }

  ngOnInit() {
    if(! this.institution.institution_key){
      this.isEditing = true;
    }
    this.message = "";
  }

  addOrUpdateInstitution(){
    let school = this.schoolDataService.getSchool();
    if(school.school_information.school_management_key){
      this.institution.school_management_key = school.school_information.school_management_key;

      if(this.institution.institution_key){
        this.institutionService.updateInstitution(this.institution).then(resp => {
          console.log("[InstitutionInfoComponent] Institution updated ....");
        });
      }else{
        this.institutionService.addInstitution(this.institution).then(resp => {
          console.log("[InstitutionInfoComponent] Institution added ...." + resp.institution_key);
          this.institution.institution_key = resp.institution_key;
        });
      }
      this.isEditing = false;
    }
    else{
      console.log("[InstitutionInfoComponent] Institution could not be added before management");
      this.message = "Please set up Management before adding Institution";
    }
  }

}
