import { Component, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
import { ClassInfo, Division, ClassTeacher, Subject as ClassSubject } from './class-info';
import { ClassInfoService } from './class-info.service';
import { ClassesDataService } from './classes-data.service';
import { SchoolDataService } from '../../management/school/school-data.service';
import { SchoolService } from '../../management/school/school.service';
import { School,Subject,Class,Divisions,CocurricularClass, AcademicYear } from '../../management/school/school';
import { SchoolResponse } from '../../management/school/school-response';
import { ModalService } from '../../_services/index';
import { EmployeeService } from '../../employees/employee.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { StudentService } from '../../student/student.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class ClassesComponent implements OnInit {

  class_infos: ClassInfo[];
  basic_class_infos: ClassInfo[];
  class_info: ClassInfo;
  constituent_subjects: Subject[];
  selected_subjects: any[];
  selected_subject: string;
  selected_subject_type: string;
  selected_class_index: number;
  selected_class_type = "regular";
  selected_academic_year: string;
  sel_aca_year_name: string;
  sel_cla_type_name: string;
  cur_aca_year_name: string;
  academic_years: AcademicYear[];
  school: School;
  divisions: string = "";
  cocurricular_class: CocurricularClass[];
  current_academic_year: string;
  selected_division: string;
  index = [];
  showbackdrop = false;
  isEditing = false;
  class_teachers: ClassTeacher[];
  teacher_datas:any;
  classes_types = [{"name":"Regular","code":"regular"},{"name":"Cocurricular","code":"cocurricular"}];
  editing_teacher_div:any;
  searchText;
  students;
  constructor(private schoolDataService: SchoolDataService,
              private schoolService: SchoolService,
              private classesDataService :ClassesDataService,
              private classInfoService : ClassInfoService,
              private modalService: ModalService,
              private employeeService: EmployeeService,
              public toastr: ToastsManager,
              private studentService: StudentService,
              vcr: ViewContainerRef
              ) {
                this.toastr.setRootViewContainerRef(vcr);
              }

  ngOnInit() {
    this.selected_subject = null;
    this.selected_subject_type = null;
    this.academic_years = this.schoolDataService.getSchool().academic_years;
    this.school = this.schoolDataService.getSchool();
    console.log(this.school);
    this.validateConfiguration(this.school);
    this.current_academic_year = this.schoolDataService.getCurrentAcademicYear().code;
    this.cur_aca_year_name = this.schoolDataService.getCurrentAcademicYear().name;
    this.index.push(2);
    this.selected_class_type = this.sel_cla_type_name = "regular";
    this.selectYear(this.current_academic_year, this.cur_aca_year_name);
    this.employeeService.getEmployeeList(this.school.school_id).then(datas => {
      console.log(datas);
      this.teacher_datas = datas
    });
    this.class_info = new ClassInfo;
    this.class_info.type = 'regular';
    this.class_info.academic_year = null;
    this.class_info.subjects = [];
    this.editing_teacher_div = -1;
    this.class_teachers = [];
    this.searchText = '';
    this.basic_class_infos = this.class_infos = [];
    this.studentService.getStudentList(this.school.school_id).then(resp => {
      this.students = resp;
      console.log(this.students);
    });
  }

  private showNotification(type, message) {
    switch (type) {
      case "success":
        this.toastr.success(message, 'Success!');
        break;
      case "error":
        this.toastr.error(message, 'Oops!');
        break;
      case "warning":
        this.toastr.warning(message, 'Alert!');
        break;
      case "info":
        this.toastr.info(message);
        break;
    }
  }

  openModal(modal_name) {
    (<any>$('#' + modal_name)).appendTo('body').modal();
  }

  private validateConfiguration(school: School){
    if(! school.academic_years || school.academic_years.length == 0){
      console.warn("Academic years not configured")
    }
    if(! school.subjects || school.subjects.length == 0){
      console.warn("Subjects not configured for school")
    }
    if(! school.subject_types || school.subject_types.length == 0){
      console.warn("Subject types not configured for school")
    }
  }

  public selectYear(academic_year, aca_year_name){
    console.log("[ClassesComponent]  selecting classes ", academic_year, aca_year_name);
    this.selected_academic_year = academic_year;
    this.sel_aca_year_name = aca_year_name;
    this.loadClasses();
  }

  public setClassType(class_type, cla_type_name){
    this.selected_class_type = class_type;
    this.sel_cla_type_name = cla_type_name;
    if(!this.selected_academic_year){
      this.selected_academic_year = this.current_academic_year;
      this.sel_aca_year_name = this.cur_aca_year_name;
    }
    if (this.selected_academic_year != "Select Academic Year" && this.selected_class_type != "Select Class Type")this.loadClasses();
  }

  addSubject(){
    if(this.selected_subject && this.selected_subject_type){
      let subject = this.school.academic_configuration.subjects.find(x=>x.code===this.selected_subject);
      let new_subject: ClassSubject = new ClassSubject();
      new_subject.code = subject.code;
      new_subject.name = subject.name;
      new_subject.type = this.selected_subject_type;
      if(!this.class_info.subjects){
        this.class_info.subjects = [];
      }
      this.class_info.subjects.push(new_subject);
    }
    this.selected_subjects = [];
    this.selected_subject = null;
    this.selected_subject_type = null;
  }

  getSubjectList(){
    let subjects : Subject[] = [];
    if(!this.school.subjects){
      console.warn("Subjects not configured for school");
      // return subjects;
    }
    if(this.class_info.subjects){
      for(let subject of this.school.academic_configuration.subjects){
        if(this.class_info.subjects.findIndex(x => x.code === subject.code)<0){
          subjects.push(subject);
        }
      }
    }
    else{
      subjects = this.school.academic_configuration.subjects;
    }
    return subjects;
  }

  addOrRemoveConstituentSubject(code){
    let is_selected = this.selected_subjects.find(x => x.code === code).selected
    this.selected_subjects.find(x => x.code === code).selected = !is_selected;
  }

  getConstituentSubjects(constituent_subjects){
    let subjects: string;
    if(constituent_subjects){
      subjects = '(';
      for(let sub of constituent_subjects){
        subjects = subjects+this.getSubjectName(sub)+', ';
      }
      subjects = subjects.substring(0,subjects.length-2) +')';
    }
    return subjects;
  }

  getSelectedSubjects(){
    this.selected_subjects = [];
    let child_subjects: string[] = [];
    let parent_subjects = this.class_info.subjects.filter(x => x.constituent_subjects !== undefined);
    for(let subject of parent_subjects){
      for(let sub of subject.constituent_subjects){
        if(!child_subjects.find(x=>x===<any>sub)){
          child_subjects.push(<any>sub);
        }
      }
    }
    for(let subject of this.class_info.subjects){
      if(!child_subjects.find(x => x === subject.code)){
        let sub: any = subject;
        sub.selected = false;
        this.selected_subjects.push(sub);
      }
    }
  }

  removeSubject(code){
    let index = this.class_info.subjects.findIndex(x => x.code === code);
    if(index > -1){
      this.class_info.subjects.splice(index,1);
    }
  }

  getSubjectName(code){
    return this.school.academic_configuration.subjects.find(x => x.code === code).name;
  }

  searchClass() {
    console.log('[ClassesComponent] searchClass - ', this.searchText);
    console.log('[ClassesComponent] basic_class_infos - ', this.basic_class_infos);
    let txt = this.searchText;
    if (txt == '') {
      this.class_infos = this.basic_class_infos;
    } else if(this.basic_class_infos.length > 0){
      this.class_infos = this.basic_class_infos.filter(x => {
         if (x.class_code.indexOf(txt) >= 0)  return true;
         let teacher = false;
         x.divisions.forEach(division => {
           if ((<string>this.getTeacherName(division.class_teacher_employee_key)).indexOf(txt) >= 0)
             teacher = true;
         });
         return teacher;
      });
    }
    this.classesDataService.setClasses(this.class_infos);
    for(let _class of this.class_infos){
      this.index.push(_class.order_index);
    }
  }

  private loadClasses() {
    let school_key = this.schoolDataService.getSchool().school_id;
    this.basic_class_infos = [];
    this.searchText = '';
    this.classInfoService.getClassInfoList(school_key).then(resp => {
      this.basic_class_infos = resp.filter(x => (x.type === this.selected_class_type && x.academic_year === this.selected_academic_year));
      this.basic_class_infos.sort(function(a,b){
        return (a.order_index) - (b.order_index);
      });
      this.searchClass();
      this.classesDataService.setClasses(this.class_infos);
      // this.selectClass(0);
      for(let _class of this.class_infos){
        this.index.push(_class.order_index);
      }
    });
  }

  public addNewClassInfo() {
    this.openModal('add-class-modal');
    this.isEditing = true;
    let school_key = this .schoolDataService.getSchool().school_id;
    if (!this.class_infos) {
      this.class_infos = [];
    }
    this.divisions = '';
    this.class_teachers = [];
    let _classinfo = new ClassInfo();
    _classinfo.type = 'regular';
    _classinfo.academic_year = null;
    _classinfo.eligible_classes = [];
    _classinfo.subjects = [];
    // this.class_infos.push(_classinfo);
    // this.selected_class_index= this.class_infos.length - 1;
    // this.class_info = this.class_infos[this.selected_class_index];
    this.class_info = _classinfo;
  }

  public selectClass(i) {
    this.isEditing = false;
    this.class_info = this.class_infos[i];
    this.class_info.subjects = this.class_info.subjects ? this.class_info.subjects : [];
    this.selected_class_index = i;
    this.divisions = '';
    this.class_teachers = [];
    for(let div of this.getDivisionsOfSelectedClass()){
      this.divisions = this.divisions + div.code;
      this.class_teachers.push({division: div.code, employee_key: div.class_teacher_employee_key});
      if(this.getDivisionsOfSelectedClass().indexOf(div)!==this.getDivisionsOfSelectedClass().length-1){
        this.divisions = this.divisions +',';
      }
    }
    this.selected_subject = null;
    this.selected_subject_type = null;
  }

  public cancelClass(){
    if(this.class_info.class_info_key){
      this.isEditing = false;
    }else{
      this.class_infos.splice(this.selected_class_index);
      this.selectClass(0);
    }
    this.divisions ="";
  }

  public addOrUpdateClassInfo() {
    if (this.class_info.class_info_key)
    {
      this.updateClassInfo();
    }
    else {
      this.addClassInfo();
    }
  }

  private addClassInfo() {
    this.class_info.school_key = this.school.school_id;
    this.classInfoService.addClassInfo(this.class_info).then(resp => {
      this.class_info.class_info_key = resp.class_info_key;
      let co_class = new CocurricularClass();
      co_class.class_info_key = resp.class_info_key;
      let school = this.schoolDataService.getSchool();
      if (!school.cocurricular_classes) {
        school.cocurricular_classes = [];
      }
      school.cocurricular_classes.push(co_class);
      this.schoolService.updateSchool(school).then(school_resp => {
        this.schoolDataService.setSchool(school);
      })
      this.loadClasses();
      this.isEditing = false;
    })
  }

  private updateClassInfo() {
    this.class_info.school_key = this.school.school_id;
    this.classInfoService.updateClassInfo(this.class_info).then(resp => {
      this.loadClasses();
      this.isEditing = false;
     })
  }

  public selectedDivision() {
    for(let divn of this.class_info.divisions)
    this.selected_division= divn.code +',';
  }

  checkValidation() {
    let retval = 'true';
    if (!this.class_info.class_code) retval = 'Class';
    else if (this.class_info.academic_year == "Select Academic Year") retval = 'Academic year';
    else if (this.divisions.length == 0) retval = 'Division';
    else if (this.class_info.subjects.length == 0) retval = 'Subject';
    if (retval != 'true'){
      this.showNotification('error', retval + ' is required!');
    }
    return retval=='true' ? true : false;
  }

  public updateTeacherName() {
    if (!this.checkValidation()) return;
    this.updateRegularClass();
  }
  public addOrUpdateRegularClass() {
    if (!this.checkValidation()) return;
    if (this.class_info.class_info_key) {
      this.updateRegularClass();
    }
    else {
      this.addRegularClass();
    }
  }

  public orderIndex() {
    let index = this.index;
    let maxindex = Math.max(...index)
    this.class_info.order_index = maxindex + 2;
  }

  private addRegularClass() {
    this.orderIndex();
    this.class_info.divisions=[]
    let divs: string[] = this.divisions.split(',');
    for(let i = 0; i < divs.length; i ++) {
      let div  = new Division();
      div.name = divs[i];
      div.code = divs[i];
      div.class_teacher_employee_key = this.class_teachers[i].employee_key;
      this.class_info.divisions.push(div);
    }
    this.class_info.school_key = this.school.school_id;
    this.class_info.name = this.class_info.class_code;
    this.classInfoService.addClassInfo(this.class_info).then(resp => {
      this.class_info.class_info_key = resp.class_info_key;
       this.class_infos = [];
       this.class_infos.push(resp.class_info_key);
       this.classInfoService.updateClassInfo(this.class_info).then(resp =>{
         // this.classesDataService.setClasses(this.class_infos);
       })
      this.isEditing = false;
      this.loadClasses();
      (<any>$('.modal')).modal('hide');
     })
     this.divisions = "";
     this.class_teachers = [];
  }

  private updateRegularClass() {
    this.class_info.divisions = [];
    let divs: string[] = this.divisions.split(',');
    for(let i = 0; i < divs.length; i ++) {
      let div  = new Division();
      div.name = divs[i];
      div.code = divs[i];
      div.class_teacher_employee_key = this.class_teachers[i].employee_key;
      this.class_info.divisions.push(div);
    }
    this.class_info.school_key = this.school.school_id;
    this.class_info.name = this.class_info.class_code;
    this.classInfoService.updateClassInfo(this.class_info).then(resp => {
     // this.classesDataService.setClasses(this.class_infos)
     this.isEditing = false;
     this.loadClasses();
     (<any>$('.modal')).modal('hide');
    })
    this.divisions = "";
    this.class_teachers = [];
  }

  public getClassesList() {
    return this.classesDataService.getClasses().filter(x => (x.academic_year === this.class_info.academic_year) && (x.type === "regular"))
    .sort(function(a,b){return (a.order_index) - (b.order_index)});

  }

  public getDivisionsOfSelectedClass() {
    return this.classesDataService.getDivisionCodesList(this.selected_academic_year, this.class_info.class_info_key);
  }

  public getDivision(cla_info_key) {
    return this.classesDataService.getDivisionCodesList(this.selected_academic_year, cla_info_key);
  }

  addDivision(){
    if(this.divisions.length === 0) {
      this.divisions = 'A';
      this.class_teachers.push({division: 'A', employee_key: null});
    }
    else {
      var code = this.divisions.charCodeAt(this.divisions.length-1);
      var next_char = String.fromCharCode(code+1);
      this.class_teachers.push({division: next_char, employee_key: null});
      this.divisions = this.divisions+','+next_char;
    }
  }

  deleteDivision() {
    if(this.divisions.length > 0){
      this.divisions = this.divisions.substring(0,this.divisions.length-2);
      this.class_teachers = this.class_teachers.slice(0, this.class_teachers.length - 1);
    }
   }

  public addOrRemoveClass(cls) {
    let index = this.class_info.eligible_classes.findIndex( x => x === cls);
    if(index > -1){
      this.class_info.eligible_classes.splice(index, 1);
    }else{
      this.class_info.eligible_classes.push(cls);
    }
  }

  public isClassSelected(cls) {
    let index = this.class_info.eligible_classes.findIndex( x => x === cls);
    if(index > -1){
      return true;
    }else{
      return false;
    }
  }

  public onViewTimetable() {
    console.log(111);
  }

  public editClassInfo(i, j = -1) {
    this.isEditing = true;
    this.class_info = this.class_infos[i];
    this.class_info.subjects = this.class_info.subjects ? this.class_info.subjects : [];
    this.selected_class_index = i;
    this.divisions = '';
    this.class_teachers = [];
    if (j != -1) {
      this.openModal('edit-class-teacher');
      this.editing_teacher_div = j;
    }
    else { this.openModal('add-class-modal'); }
    for(let div of this.getDivisionsOfSelectedClass()){
      let emp_key = null;
      if (typeof div.class_teacher_employee_key !== 'undefined') emp_key = div.class_teacher_employee_key;
      this.divisions = this.divisions + div.code;
      this.class_teachers.push({division: div.code, employee_key: emp_key});
      if(this.getDivisionsOfSelectedClass().indexOf(div)!==this.getDivisionsOfSelectedClass().length-1){
        this.divisions = this.divisions +',';
      }
    }
    console.log(this.editing_teacher_div);
    this.selected_subject = null;
    this.selected_subject_type = null;
  }

  public onDeleteClass() {

  }

  onClick(event) {
     (<any>$('.aca-classes .collapse')).collapse('hide');
  }

  // openModal(id: string){
  //   this.modalService.open(id);
  // }

  // closeModal(id: string){
  //   this.modalService.close(id);
  // }

  selAcademicYear(code) {
    this.class_info.academic_year = code;
  }

  onLiSelect(type, code, i = 0) {
    switch (type) {
      case "academic_year":
        this.class_info.academic_year = code;
        break;

      case "teacher_name":
        this.class_teachers[i].employee_key = code;
        break;

      case "subject":
        this.selected_subject = code;
        break;

      case "subject_type":
        this.selected_subject_type = code;
        break;
    }
  }

  getTeacherName(employee_key) {
    if (this.teacher_datas){
      let teacher = this.teacher_datas.find(x => (x.employee_key == employee_key));
      if(teacher){
        return teacher.full_name;
      }
    }
    return '';
  }

  getFullName(teacher_info, type = 0) {
    if (type == 0){
      if (!teacher_info.employee_key) return "Select class teacher for division " + teacher_info.division;
      return this.getTeacherName(teacher_info.employee_key);
    }
    if (typeof teacher_info.class_teacher_employee_key == 'undefined' || !teacher_info.class_teacher_employee_key)
      return '';
    return this.getTeacherName(teacher_info.class_teacher_employee_key);
  }

  getTeaName() {
    if (this.class_teachers.length == 0 || this.editing_teacher_div == -1) return ' ';
    let teacher_info = this.class_teachers[this.editing_teacher_div];
    if (!teacher_info.employee_key) return "Select class teacher for division " + teacher_info.division;
    return this.getTeacherName(teacher_info.employee_key);
  }

  getSubName() {
    if (!this.selected_subject) return "Select subject";
    let subName = this.getSubjectList().find(x => (x.code == this.selected_subject));
    return subName.name;
  }

  getSubType() {
    if (!this.selected_subject_type) return "Select type";
    let subType = this.school.academic_configuration.subject_types.find(x => (x.code == this.selected_subject_type));
    return subType.name;
  }

  getStudentsCount(cla_code, div_code) {
    if(this.students){
      let students = this.students.filter(student => (student.current_class == cla_code && student.division == div_code));
      if(students){
        return students.length;
      }
    }
    return 0;
  }

  hasValue() {
    if (this.class_teachers.length == 0 || typeof this.editing_teacher_div === 'undefined' || this.editing_teacher_div == -1) return false;
    let tmp = this.class_teachers[this.editing_teacher_div];
    return tmp.employee_key ? true : false;
  }
}
