import { Component, OnInit } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';

import { School, Class, AcademicYear } from '../../management/school/school';
import { ClassInfo } from '../classes/class-info';
import { Student } from '../../student/student';

import { SchoolDataService } from '../../management/school/school-data.service';
import { ClassesDataService } from '../classes/classes-data.service';
import { StudentService } from '../../student/student.service';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnInit {

  classes: ClassInfo[] = [];
  academic_years: AcademicYear[];
  school: School;
  result_list: any[] = [];
  promoted_list: Student[] = [];
  students: Student[];
  current_class: ClassInfo;
  promoted_class: ClassInfo;
  promoted_class_info_key: string;
  selected_academic_year: string;
  selected_class: string;

  public notification_options = {
    position: ["bottom", "right"],
    timeOut: 5000,
    lastOnBottom: true
  };

  constructor(private schoolDataService: SchoolDataService,
              private classesDataService: ClassesDataService,
              private studentService: StudentService,
              private _service: NotificationsService
              )
  { }

  ngOnInit() {
    this.school = this.schoolDataService.getSchool();
    this.academic_years = this.school.academic_years.sort(function(a,b){return +(a.start_date) - +(b.start_date)});
    this.selected_academic_year = this.schoolDataService.getCurrentAcademicYear().code;
    this.classes = this.classesDataService.getClasses().filter( x => x.type === "regular" && x.academic_year === this.selected_academic_year)
                                                       .sort(function(a,b){return (a.order_index) - (b.order_index)});
    this.getStudentList();
  }

  academicYearChange(){
    if(this.selected_academic_year){
      this.classes = this.classesDataService.getClasses().filter( x => x.type === "regular" && x.academic_year === this.selected_academic_year)
                                                         .sort(function(a,b){return (a.order_index) - (b.order_index)});
    }
    this.reset();
  }

  public setPromotedClass(class_key){
    this.promoted_class = this.classesDataService.getClasses().find(x => x.class_info_key === class_key);
  }

  public getClasses(academic_year){
    return this.classesDataService.getClasses().filter( x => x.type === "regular" && x.academic_year === academic_year)
                                                       .sort(function(a,b){return (a.order_index) - (b.order_index)});
  }

  private reset(){
    this.result_list = [];
    this.promoted_list = [];
    this.selected_class = undefined;
    this.current_class = undefined;
    this.promoted_class = undefined;
  }

  getFilteredStudentList(){
    this.current_class = this.classes.find( x => x.class_info_key === this.selected_class);
    this.promoted_class = this.getPromotedClassInfo();
    this.promoted_list = [];
    this.result_list = this.students;

    if(this.selected_class){
      this.result_list = this.result_list.filter( x => x.current_class_key === this.selected_class);
    }
  }

  private getStudentList(){
    this.studentService.getStudentList(this.schoolDataService.getSchool().school_id).then(resp => {
      this.students = resp;
    });
  }


  selectedStudentChange(event){
    let student : any = this.promoted_list.find( x => x.student_key === event.target.name);
    let index = this.promoted_list.indexOf(student);
    if(event.target.checked){
      if(index === -1){
        student = this.result_list.find( x => x.student_key === event.target.name);
        student.current_class_key = this.promoted_class.class_info_key;
        student.current_class = this.promoted_class.name;
        this.promoted_list.push(student);
      }
    }
    else{
      student = this.result_list.find( x => x.student_key === event.target.name);
      student.current_class_key = this.current_class.class_info_key;
      student.current_class = this.current_class.name;
      this.promoted_list.splice(index, 1);
    }
  }

  promoteStudents(){
    let student_updates = []
    for(let stud of this.promoted_list){
      let update = this.studentService.updateStudent(stud).then(updateStudentResponse => {
        console.log('Updated student class.');
      });
      student_updates.push(update)
    }
    Promise.all(student_updates).then(x => {
      this.showNotification("Success", this.promoted_list.length + " students promoted");
      this.getStudentList();
      this.getFilteredStudentList()
    }).catch(x => {
      this.showErrorNotification("Error", "Promotions could not be completed");
    });
  }

  getPromotedClassInfo(): ClassInfo{
    let academic_year = this.academic_years.find( x => x.code === this.selected_academic_year);
    let index = this.academic_years.indexOf(academic_year);
    let next_academic_year = this.academic_years[index+1];
    if(next_academic_year){
      let current_class_code = this.classes.find( x => x.class_info_key === this.selected_class).class_code;
      let next_year_class = this.classesDataService.getClasses().find( x => x.academic_year === next_academic_year.code
        && x.class_code === current_class_code);
      let next_year_classes_list = this.classesDataService.getClasses().filter( x=> x.academic_year === next_academic_year.code && x.type === 'regular')
                                      .sort((a,b) => (a.order_index - b.order_index));
      let new_class = next_year_classes_list[next_year_classes_list.indexOf(next_year_class) + 1]
      return new_class;
    }else{
      this.showWarningNotification("Academic Year", "Next academic year is not configured.");
    }
  }

  private showNotification(msg_type, message){
    const toast = this._service.success(msg_type, message, {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

  private showWarningNotification(msg_type, message){
    const toast = this._service.warn(msg_type, message, {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

  private showErrorNotification(msg_type, message){
    const toast = this._service.error(msg_type, message, {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: false,
      clickIconToClose: true
    });
  }
}
