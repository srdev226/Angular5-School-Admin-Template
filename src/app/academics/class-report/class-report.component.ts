import { Component, OnInit } from '@angular/core';
import { ClassInfoService} from '../classes/class-info.service';
import { School, Class, Divisions, AcademicYear, ExamConfiguration, ExamSeries } from '../../management/school/school';
import { SchoolDataService } from '../../management/school/school-data.service';
import { EmployeeService } from '../../employees/employee.service';
import { Employee } from '../../employees/employee';
import { StudentService } from '../../student/student.service';
import { Student } from '../../student/student';
import { ExamService } from '../exams/exam.service';
import { Exam } from '../exams/exam';
import { ClassInfo } from '../classes/class-info';

@Component({
  selector: 'app-class-report',
  templateUrl: './class-report.component.html',
  styleUrls: ['./class-report.component.css']
})
export class ClassReportComponent implements OnInit {
  all_classes: any;
  selected_index;
  classes_data: any;
  school: School;
  teacher_datas: Employee[];
  selected_teacher: string;
  all_student_list: Student[];
  selected_student_list: Student[];
  exams_for_selected_class: ExamSeries[];
  all_exams: ExamSeries[];
  selected_exam_index: number;
  selected_student_index: number;
  selected_class: ClassInfo;
  academic_years: any;
  selected_academic_year: string;
  sel_aca_year_name: string;
  selected_division: string;
  
  constructor(private classInfoService: ClassInfoService,
              private schoolDataService: SchoolDataService,
              private employeeService: EmployeeService,
              private studentService: StudentService,
              private examService: ExamService,) { }

  ngOnInit() {
    this.format();
  }

  format() {
    this.all_classes = [];
    this.exams_for_selected_class = [];
    this.school = this.schoolDataService.getSchool();
    this.academic_years = this.school.academic_years;
    this.selected_academic_year = this.schoolDataService.getCurrentAcademicYear().code;
    this.all_exams = this.school.academic_configuration.exam_configuration.exam_series;
    this.employeeService.getEmployeeList(this.school.school_id).then(datas => {
      this.teacher_datas = datas;
    });
    this.studentService.getStudentList(this.schoolDataService.getSchool().school_id).then(resp => {
      this.all_student_list = resp;
    });
    this.getClassData();
  }

  getClassData() {
    this.selected_index = this.selected_student_index = this.selected_exam_index = -1;
    this.all_classes = [];
    this.classInfoService.getClassInfoList(this.school.school_id).then(resp => {
      this.classes_data = resp.filter(x => (x.type === "regular" && x.academic_year == this.selected_academic_year));
      this.classes_data.sort(function(a,b){
        return (a.order_index) - (b.order_index);
      });
      this.classes_data.forEach(cla => {
        if (typeof cla.divisions != 'undefined') {
          cla.divisions.forEach(div => {
            this.all_classes.push({name: cla.name, division: div.name, class_key: cla.class_info_key})
          });
        }
      });
    });
  }

  selectYear(academic_year, aca_year_name){
    this.selected_academic_year = academic_year;
    this.sel_aca_year_name = aca_year_name;
    this.getClassData();
  }

  hasValue() {
  	return false;
  }

  getSelExam() {
    if (this.selected_exam_index == -1)
  	  return "Select Exam/ Test";
    return this.exams_for_selected_class[this.selected_exam_index].name;
  }

  viewDetailedMarkList() {
  	this.closeModal();
    (<any>$('#view-detailed-marklist')).appendTo('body').modal();
  }

  openModal(modal_name, code = -1) {
    switch (modal_name) {
      case "view-student-marklist":
        this.selected_student_index = code;
        break;
      
      case "view-detailed-mark":
        this.selected_exam_index = -1;
        break;
    }
    (<any>$('#' + modal_name)).appendTo('body').modal();
  }

  closeModal() {
  	let element = (<any>$('.modal'));
    element.modal('hide');
  }

  viewOverlayBack(name) {
    // this.ngOnInit();
    //this.closeModal();
  }

  selectExam(index) {
    this.selected_exam_index = index;
  }

  selectClass(index) {
    this.selected_exam_index = this.selected_index = -1;
    this.exams_for_selected_class = [];
    this.selected_class = this.classes_data.find(x => (x.name == this.all_classes[index].name));
    this.selected_division = this.all_classes[index].division;
    this.selected_teacher = this.selected_class.divisions.find(x => (x.name == this.all_classes[index].division)).class_teacher_employee_key;
    this.selected_student_list = this.all_student_list.filter(student => (student.current_class_key == this.selected_class.class_info_key));
    this.all_exams.forEach(exam_series => {
      console.log(this.selected_class.class_info_key);
      if (exam_series.classes.find(x => (x.class_key == this.all_classes[index].class_key)))
        this.exams_for_selected_class.push(exam_series);
    });
    this.selected_index = index;
  }

  getSelectedClassName(input = '') {
    if (this.selected_index == -1) return "Select Class";
    let retval = this.all_classes[this.selected_index].name + " " + this.all_classes[this.selected_index].division;
    if (input == 'input') return 'Class ' + retval;
    return retval;
  }

  getSelectedTeacherName() {
    if (this.selected_index == -1) return "";
    return this.teacher_datas.find(teacher => (teacher.employee_key == this.selected_teacher)).full_name;
  }

  getSelectedStudentsCount() {
    if (this.selected_index == -1) return "";
    return this.selected_student_list.length;
  }

  getRollNo(num) {
    num ++;
    if (num >= 100) return num;
    if (num >= 10) return "0" + num;
    return "00" + num;
  }
}
