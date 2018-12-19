import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { School } from './school';
import { SchoolService } from './school.service';
import { SchoolDataService } from './school-data.service';
import { SchoolResponse } from './school-response';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {

    school: School = new School();
    message: string;

    isEditing: boolean = false;

    constructor(private schoolService: SchoolService,
                private schoolDataService: SchoolDataService,
                private route: ActivatedRoute,
                private router: Router) { }

    ngOnInit() {
      this.isEditing = false;
      this.school = this.schoolDataService.getSchool();
      let school_id;
      this.route.params.forEach((params: Params) => {
        school_id = +params['schoolID'];
      })
      if (!school_id) {
        school_id = this.school.school_id;
      }
      this.schoolService.getSchool(school_id)
      .then(school => this.school = school);
    }

    public updateSchool(){
      this.schoolService.updateSchool(this.school).then(updateSchoolResponse => {
        this.isEditing = false;
        this.schoolDataService.setSchool(this.school);
      });
   }   

}
