import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Pipe,PipeTransform} from '@angular/core';

import { StudentInfo } from '../../student-info/student-info';
import { StudentFilter } from './student-filter';

@Pipe({
    name: 'studentsPipe',
    pure: true
})

export class StudentsPipe implements PipeTransform {

    constructor()
    {}

    transform(students_list: StudentInfo[], student_filter: StudentFilter ): any {
      console.log('[SearchStudentPipe] ', (student_filter ? student_filter.search_string : "NA"));
      if(!student_filter || !student_filter.search_string){
        return [];
      }
      let result_list = students_list.filter(x=>x.student.status !== 'TC');
      let result_list_all =students_list;

      for(let search_str_elm of student_filter.search_string_elements){
        switch(search_str_elm.code){
          case "name":
            result_list = result_list.filter(x => x.student.full_name.toLowerCase().includes(search_str_elm.value.toLowerCase()));
            break;
          case "admno":
            result_list = result_list.filter(x => x.student.admission_number.toLowerCase().includes(search_str_elm.value));
            break;
          case "classes":
            let class_results = [];
            for(let cls of student_filter.classes){
              class_results = class_results.concat(result_list.filter(x => x.student.current_class_key === cls));
            }
            result_list = class_results;
            break;
          case "gen":
            result_list = result_list.filter(x => x.student.gender.toString().toLowerCase().startsWith(search_str_elm.value.toLowerCase()));
            break;
          case "status":
            if( search_str_elm.value === 'TC'){
            result_list = result_list_all.filter(x => x.student.status === 'TC');
            }
            break;
          case "division":
            let division_results = [];
            for(let divn of student_filter.divisions){
              division_results = division_results.concat(result_list.filter(x => x.student.division === divn));
            }
            result_list = division_results;
            break;
        }
      }
      return result_list;
    }
}
