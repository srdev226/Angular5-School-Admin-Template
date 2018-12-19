import { Injectable } from '@angular/core';
import { ClassInfo } from './class-info';

@Injectable()
export class ClassesDataService {

  private classes: ClassInfo[];

  constructor() { }

  setClasses(classes: ClassInfo[]) {
    this.classes = classes;
  }

  getClasses(): ClassInfo[] {
    return this.classes;
  }


  getDivisionCodesList(academic_year, class_key) {
    let cls = this.classes.find( x => (x.academic_year === academic_year && x.class_info_key === class_key));
    // let divisions_codes = [];
    // if(cls){
    //   for(let division of cls.divisions){
    //     divisions_codes.push(division.code);
    //   }
    // }
    // console.log(this.classes, academic_year, class_key);
    return cls ? cls.divisions : [];
  }

}
