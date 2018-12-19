import { Injectable } from '@angular/core';
import { School, AcademicYear } from './school';
import * as moment from 'moment';

@Injectable()
export class SchoolDataService {

  school:School  = new School();

  constructor() { }

  setSchool(school:School){
    this.school = school;
  }

  getSchool(): School{
    return this.school;
  }

  getCurrentAcademicYear(): AcademicYear{
    if(this.school && this.school.academic_years){
      for(let academic_year of this.school.academic_years){
        let str_now = moment().format('DD/MM/YYYY');
        let now = moment(str_now,'DD/MM/YYYY',true);
        let start = moment(academic_year.start_date,'DD/MM/YYYY',true);
        let end = moment(academic_year.end_date,'DD/MM/YYYY', true);
        if(now.isSameOrAfter(start) && now.isSameOrBefore(end)){
          return academic_year;
        }
      }
    }
  }

  getCurrencyCode(): string{
    let curr_code = 'INR';
    if (this.school && this.school.region_configuration && this.school.region_configuration.currency){
      curr_code = this.school.region_configuration.currency;
    }
    return curr_code;
  }

}
