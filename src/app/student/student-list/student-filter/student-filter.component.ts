import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { StudentFilter, SearchStringElement } from './student-filter';
import { School, AcademicYear } from '../../../management/school/school';
import { ClassesDataService } from '../../../academics/classes/classes-data.service';
import { SchoolDataService } from '../../../management/school/school-data.service';

@Component({
  selector: 'app-student-filter',
  templateUrl: './student-filter.component.html',
  styleUrls: ['./student-filter.component.css']
})
export class StudentFilterComponent implements OnInit {

  @Input()
  readOnly: boolean;

  @Input() // here input and output are both student filter. So different variables required to avoid circular binding
  input_student_filter: StudentFilter;

  @Output()
  onFilterChange = new EventEmitter<StudentFilter>();

  student_filter: StudentFilter;
  filter_code: string;
  available_filters = [{"code":"name","name":"Name"},{"code":"admno","name":"Admission Number"},{"code":"classes","name":"Class"},{"code":"division","name":"Division"},{"code":"gen","name":"Gender"},{"code":"status","name":"Status"}];
  current_academic_year: string;
  academic_years: AcademicYear[];
  selected_year: string;

  constructor(private classesDataService: ClassesDataService,
              private schoolDataService: SchoolDataService) { }

  ngOnInit() {
    if(!this.input_student_filter){
      this.student_filter = new StudentFilter();
    }else{
      this.student_filter = this.input_student_filter;
    }
    this.current_academic_year = this.schoolDataService.getCurrentAcademicYear().code;
    this.academic_years = this.schoolDataService.getSchool().academic_years;
    this.setCurrentYear()
  }

  public getClassesList(){
    return this.classesDataService.getClasses().filter(x => (x.academic_year === this.selected_year && x.type ==='regular'))
     .sort(function(a,b){return (a.order_index) - (b.order_index)});
  }

  public filterClassesBySelectedYear(){
    this.classesDataService.getClasses().filter(x => (x.academic_year === this.selected_year))
    this.clearFilter();
  }

  private setCurrentYear(){
    for(let academic_year of this.academic_years){
     if(academic_year.code === this.current_academic_year)
     this.selected_year = academic_year.code;
    }
  }

  public setSearchString(code, val){
    val = (val === 'undefined' ? undefined : val);
    let search_string_elm = this.student_filter.search_string_elements.find(x => x.code === code);
    if(val){
      if(!search_string_elm){
        search_string_elm = this.getNewSearchStringElement(code, val);
        this.student_filter.search_string_elements.push(search_string_elm);
      }
      search_string_elm.value = val;
    }else{
      let index = this.student_filter.search_string_elements.indexOf(search_string_elm, 0);
      if(index > -1){
        this.student_filter.search_string_elements.splice(index,1);
      }
    }
    this.student_filter.search_string = "";
    for(let s_elm of this.student_filter.search_string_elements){
      this.student_filter.search_string = this.student_filter.search_string + ' ' + s_elm.code + ":" + s_elm.value;
    }
    this.onFilterChange.emit(this.student_filter);
  }

  private getNewSearchStringElement(code, val){
    let search_string_elm = new SearchStringElement();
    search_string_elm.code = code;
    search_string_elm.value = val;
    return search_string_elm;
  }

  private setSearchStringForClasses(){
    let cls_string = "";
    for(let cls of this.student_filter.classes){
      cls_string = cls_string + this.getClassName(cls) + ","
    }
    if(cls_string){
      cls_string = cls_string.substring(0, cls_string.length-1);
    }
    this.setSearchString('classes',cls_string);
  }

  private getClassName(class_key){
    return this.classesDataService.getClasses().find(x => x.class_info_key === class_key).name;
  }

  private setSearchStringForDivisions(){
    let div_string = "";
    for(let div of this.student_filter.divisions){
      div_string = div_string + div + ","
    }
    if(div_string){
      div_string = div_string.substring(0, div_string.length-1);
    }
    this.setSearchString('division',div_string);
  }

  public addOrRemoveClass(class_key){
    let index = this.student_filter.classes.findIndex( x => x === class_key);
    if(index > -1){
      this.student_filter.classes.splice(index, 1);
    }else{
      this.student_filter.classes.push(class_key);
    }
    this.setSearchStringForClasses();
    if(this.student_filter.classes.length !== 1){
      this.clearDivisons();
    }
  }

  public getDivisionsOfSelectedClass(){
    if(this.student_filter.classes.length == 1){
      return this.classesDataService.getDivisionCodesList(this.selected_year, this.student_filter.classes[0]);
    }
  }

  public addOrRemoveDivision(division_code){
    let index = this.student_filter.divisions.findIndex( x => x === division_code);
    if(index > -1){
      this.student_filter.divisions.splice(index, 1);
    }else{
      this.student_filter.divisions.push(division_code);
    }
    this.setSearchStringForDivisions();
  }

  private clearDivisons(){
    this.student_filter.divisions = [];
    this.setSearchStringForDivisions();
  }

  public isClassSelected(class_code){
    let index = this.student_filter.classes.findIndex( x => x === class_code);
    if(index > -1){
      return true;
    }else{
      return false;
    }
  }

  public isDivisionSelected(division_code){
    let index = this.student_filter.divisions.findIndex( x => x === division_code);
    if(index > -1){
      return true;
    }else{
      return false;
    }
  }

  public clearFilter(){
    this.student_filter = new StudentFilter();
    this.onFilterChange.emit(this.student_filter);
  }

}
