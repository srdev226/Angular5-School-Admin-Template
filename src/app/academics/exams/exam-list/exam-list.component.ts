import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NotificationsService as AngularNotifications } from 'angular2-notifications' ;
import { Pipe,PipeTransform } from '@angular/core';
import { ClassInfo } from '../../classes/class-info';
import { SchoolDataService } from '../../../management/school/school-data.service';
import { SchoolService } from '../../../management/school/school.service';
import { ClassesDataService } from '../../classes/classes-data.service';
import { ExamDataService } from '../exam-data.service';
import { ClassInfoService} from '../../classes/class-info.service';
import { ExamService } from '../exam.service';
import { School, Class, Divisions, AcademicYear, ExamConfiguration, ExamSeries } from '../../../management/school/school';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Exam } from '../exam';

@Pipe({
    name: 'searchExam',
    pure: true
})

export class SearchExam implements PipeTransform {

    constructor()
    {}

    transform(exams: Exam[], name:string, series_code: string, class_key: string): any {
      console.log('name: '+name+' series_code: '+series_code+' class_key: '+class_key+ '..'+exams.length);
      let exam_list = exams;
      if(series_code === 'All' && class_key === 'All' && name === ''){
        return [];
      }
      if (name) {
        exam_list = exam_list.filter(x => {
          return (x.name.toLowerCase().includes(name.toLowerCase()));
        })
      }
      if (series_code !== 'undefined' && series_code !=="All") {
        exam_list = exam_list.filter(x => {
          return (x.series_code === series_code);
        })
      }
      if (class_key !== 'undefined' && class_key !=="All") {
        exam_list = exam_list.filter(x => {
          return (x.class_key === class_key);
        })
      }
      return exam_list;
    }
}

export class ExamFilter{
  series_code : string;
  class_key: string;
  exam_name: string;
}

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css', './datetimepicker.css']
})
export class ExamListComponent implements OnInit, AfterViewInit {
  school: School;
  examConfig: ExamSeries[];
  cur_exam: ExamSeries;
  total_examConfig: ExamConfiguration;
  exam_name = null;
  exam_code = null;
  classes: any;
  academic_years: any;
  selected_academic_year: any;
  selected_exam_code: any;
  sel_aca_year_name: any;
  from_date: NgbDateStruct;
  to_date: NgbDateStruct;
  start_year: NgbDateStruct;
  end_year: NgbDateStruct;
  classes_data: any;
  available_exams: Exam[];
  exams: Exam[];
  selAll = false;
  checkbox: any[] = [];
  text;
  selectedClasses: any[] = [];
  cur_exam_index: any;
  @ViewChild('checkList') checkList:ElementRef;
  constructor(private schoolDataService: SchoolDataService,
              private schoolService: SchoolService,
              private classInfoService: ClassInfoService,
              private examService: ExamService,
              private router: Router,
              public toastr: ToastsManager,
              private vcr: ViewContainerRef,
              ) {}

  ngOnInit() {
    this.toastr.setRootViewContainerRef(this.vcr);
    this.loadExams();
    this.academic_years = this.school.academic_years;
    this.selected_academic_year = this.academic_years[this.academic_years.length - 1].code;
    this.sel_aca_year_name = this.selected_academic_year;
    this.classInfoService.getClassInfoList(this.school.school_id).then(resp => {
      this.classes_data = resp;
      this.filterClasses();
    });
    console.log(this.examConfig);
    this.setDateRange();
    this.text = "Select Classes";
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

  ngAfterViewInit() {

  }

  filterClasses() {
    this.available_exams = [];
    this.checkbox = [];
    this.classes = this.classes_data.filter(x => (x.type === "regular" && x.academic_year == this.selected_academic_year));
    this.classes.sort(function(a,b){
      return (a.order_index) - (b.order_index);
    });
    console.log(this.classes, this.selected_academic_year);
    this.classes.forEach(cla => {
      cla.divisions.forEach(div => {
        let tmp = new Exam;
        tmp.class_key = cla.class_info_key;
        tmp.academic_year = cla.academic_year;
        tmp.status = "NEW";
        tmp.institution_key = this.school.school_id,
        tmp.division = div.code;
        tmp.visibility = "STUDENT";
        tmp.schedulable = "YES",
        tmp.schedule_status = "PENDING";
        this.available_exams.push(tmp);
        this.checkbox.push({name: cla.class_code, checked: false});
      })
    });
  }

  getExamScheduleStatus(status) {
    return status ? "Approved" : "Pending";
  }

  setDateRange() {
    let aca_year = this.academic_years.filter(x => (x.code == this.selected_academic_year))[0];
    let start_date = aca_year.start_date;
    let end_date = aca_year.end_date;
    this.start_year = {year: +start_date.substring(6), month: +start_date.substring(3, 5), day: +start_date.substring(0, 2)};
    this.end_year = {year: +end_date.substring(6), month: +end_date.substring(3, 5), day: +end_date.substring(0, 2)};
    this.examConfig = this.total_examConfig.exam_series.filter(exam => {
      if (new Date(exam.from_date) >= new Date(start_date.substring(6) + "-" + start_date.substring(3, 5) + "-" + start_date.substring(0, 2)) &&
        new Date(exam.to_date) <= new Date(end_date.substring(6) + "-" + end_date.substring(3, 5) + "-" + end_date.substring(0, 2)))
        return true;
      return false;
    });
  }
  loadExams() {
    this.school = this.schoolDataService.getSchool();
    this.total_examConfig = this.school.academic_configuration.exam_configuration;
  }

  selectYear(academic_year, aca_year_name){
    this.selected_academic_year = academic_year;
    this.sel_aca_year_name = aca_year_name;
    this.setDateRange();
    this.filterClasses();
  }

  gotoExamSchedule(exam_code) {
    this.router.navigate(['academics/exams/schedule/', exam_code, this.selected_academic_year]);
  }

  gotoExamMarking(exam_code) {

    this.router.navigate(['academics/exams/marking/', exam_code, this.selected_academic_year]);
  }

  openModal(modal_name, index = -1) {
    switch (modal_name) {
      case "add-exam-modal":
        this.exam_code = this.exam_name = null;
        this.setDropDown();
        break;

      case "edit-exam-modal":
        this.cur_exam_index = index;
        this.from_date = this.convertStrToNgbDate(this.examConfig[index].from_date);
        this.to_date = this.convertStrToNgbDate(this.examConfig[index].to_date);
        break;

      case "allow-mark-modal":
        this.cur_exam_index = index;
        if (this.examConfig[index].results_publish) {
          this.setExamResultsPublish(false);
          this.examConfig[index].results_publish = false;
          return;
        }
        this.cur_exam = this.examConfig[index];
        break;

      case "view-schedule-overlay":
        this.selected_exam_code = index;
        break;
    }
    (<any>$('#' + modal_name)).appendTo('body').modal();
  }

  closeModal() {
    (<any>$('.modal')).modal('hide');
  }

  checkValidation() {
    let retval = 'true';
    if (!this.exam_name) retval = 'Exam name';
    else if (!this.from_date || !this.to_date) retval = 'Tentative exam dates';
    else if (this.text == "Select Classes") retval = 'Classes';
    if (retval != 'true'){
      this.showNotification('error', retval + ' is required!');
    }
    return retval=='true' ? true : false;
  }

  formatNum(num:Number) {
    if (num < 10) return "0" + num.toString();
    return num.toString();
  }

  convertNgbDateToStr(date) {
    return date.year + "-" + this.formatNum(date.month) + "-" + this.formatNum(date.day);
  }

  convertStrToNgbDate(date : string) {
    let d = new Date(date);
    return {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate()};
  }

  getClassInfoKey(key) {
    return this.classes.filter(cla => (cla.class_code == key))[0].class_info_key;
  }

  addExamSeries(series) {
    let examSeries: ExamSeries = new ExamSeries;
    examSeries.name = this.exam_name;
    examSeries.code = series;
    examSeries.from_date = this.convertNgbDateToStr(this.from_date);
    examSeries.to_date = this.convertNgbDateToStr(this.to_date);
    examSeries.results_publish = examSeries.schedule_publish = false;
    examSeries.classes = [];
    for (let i = 0; i < this.available_exams.length; i ++) {
      if (!this.checkbox[i].checked) continue;
      console.log('[ExamListComponent] adding series - class key ' + this.available_exams[i].class_key);
      examSeries.classes.push({class_key: this.available_exams[i].class_key, division: this.available_exams[i].division});
    }
    this.school.academic_configuration.exam_configuration.exam_series.push(examSeries);
    this.schoolService.updateSchool(this.school).then(res => {
      this.schoolDataService.setSchool(this.school);
      this.loadExams();
      this.setDateRange();
      this.showNotification('success', "Exam series is successfully added");
    });
  }

  addExam() {
    if (!this.checkValidation()) return;
    let len = "00";
    if (this.total_examConfig.exam_series.length < 9) len = "0" + String(this.total_examConfig.exam_series.length);
    else len = String(this.total_examConfig.exam_series.length)
    let series = this.exam_name.substring(0, 3) + len;
    this.addExamSeries(series);
    for (let i = 0; i < this.available_exams.length; i ++) {
      if (!this.checkbox[i].checked) continue;
      let tmpClass = this.classes.filter(x => (x.class_info_key == this.available_exams[i].class_key))[0];
      if (typeof tmpClass.subjects == 'undefined' || tmpClass.subjects.length == 0) continue;
      tmpClass.subjects.forEach(subject => {
        let exam = this.available_exams[i];
        exam.name = this.exam_name;
        exam.max_score = 100;
        exam.audit_logs = [];
        exam.audit_logs.push({date_time: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), message: "Exam Added"});
        exam.type = "WRITTEN";
        exam.assessment_type = "SUMMATIVE";
        exam.series_code = series;
        console.log(exam);
        if (typeof subject.constituent_subjects == 'undefined' || subject.constituent_subjects.length == 0) {
          exam.subject_code = subject.code;
          let result = this.examService.addExam(exam).then(resp => {}).catch(resp => {
            this.showNotification('error', "Exams for subject : " +
              subject.name +
              "in Class " +
              this.available_exams[i].class_key +
              " " + this.available_exams[i].division +
              " could not be added"
             );
          });
        }
        else {
          subject.constituent_subjects.forEach(sub => {
            exam.subject_code = sub.code;
            let result = this.examService.addExam(exam).then(resp => {}).catch(resp => {
              this.showNotification('error', "Exams for subject : " +
                this.getSubName(sub.code) +
                "in Class " +
                this.available_exams[i].class_key +
                " " + this.available_exams[i].division +
                " could not be added"
               );
            }); 
          });
        }
      });
    }
    this.closeModal();
    this.from_date = this.to_date = null;
    this.text = "Select Classes";
    this.exam_name = null;
  }

  getSubName(sub_code) {
    return this.school.academic_configuration.subjects.find(subject => (subject.code == sub_code)).name;
  }

  setExamResultsPublish(res) {
    this.school.academic_configuration.exam_configuration.exam_series[this.cur_exam_index].results_publish = res;
    this.schoolService.updateSchool(this.school).then(res => {});
  }

  saveExamDate() {
    this.school.academic_configuration.exam_configuration.exam_series[this.cur_exam_index].from_date = this.examConfig[this.cur_exam_index].from_date = this.convertNgbDateToStr(this.from_date);
    this.school.academic_configuration.exam_configuration.exam_series[this.cur_exam_index].to_date = this.examConfig[this.cur_exam_index].to_date = this.convertNgbDateToStr(this.to_date);
    this.schoolService.updateSchool(this.school).then(res => {});
    this.closeModal();
  }

  confirm() {
    this.closeModal();
    this.cur_exam.results_publish = true;
    this.setExamResultsPublish(true);
  }

  setDropDown() {
    $('.check-dropdown li').on('click', function (event) {
      $(this).parent().addClass('open');
    });

    $('body').on('click', function (e) {
      if (!$('ul.dropdown-menu.check-dropdown').is(e.target)
        && $('ul.dropdown-menu.check-dropdown').has(e.target).length === 0
        && $('.open').has(e.target).length === 0
      ) {
        $('.check-dropdown').removeClass('open');
      }
    });
  }

  onLiSelect(type, code = '',name = '') {
    switch (type) {
      case "exam_type":
        this.exam_code = code;
        this.exam_name = name;
        break;
    }
  }

  getExamType() {
    if (!this.exam_code) return "Select Exam Type";
    return this.exam_code == 'Other' ? 'Other' : this.exam_name;
  }

  getText(index = -1) {
    this.selectedClasses = [];
    if (index != -1) this.checkbox[index].checked = !this.checkbox[index].checked;
    if (this.checkbox.length == 0) {
      this.text = "Select Classes";
      return;
    }
    this.text = "";
    let j = 0, k = 0;
    for (let i = 0; i < this.checkbox.length; i ++) {
      if (this.checkbox[i].checked == false) continue;
      if (j == 5) {
        this.text += "..";
        j ++;
      }
      if (j < 5) {
        if (j) this.text += ",";
        this.text += "Class " + this.checkbox[i].name + this.available_exams[i].division;
        j ++;
      }
      if (this.selectedClasses.length == 0) {
        this.selectedClasses.push({name: this.checkbox[i].name, divisions: []});
      }
      else if (this.selectedClasses[k].name != this.checkbox[i].name) {
        k ++;
        this.selectedClasses.push({name: this.checkbox[i].name, divisions: []});
      }
      this.selectedClasses[k].divisions.push(this.available_exams[i].division);
    }
    if (this.text == '') this.text = "Select Classes";
  }

  selectAll() {
    this.selAll = !this.selAll;
    if (this.selAll == true) {
      for (let i = 0; i < this.checkbox.length; i ++) {
        this.checkbox[i].checked = true;
      }
    }
    else {
      for (let i = 0; i < this.checkbox.length; i ++) {
        this.checkbox[i].checked = false;
      }
    }
    this.getText();
  }

  unCheck(cla, div) {
    let exam = this.available_exams.filter(x => (x.class_key == cla && x.division == div))[0];
    console.log(exam, this.available_exams.indexOf(exam));
    this.checkbox[this.available_exams.indexOf(exam)].checked = false;
    this.getText();
  }

  deleteClass(i, j, cla, div) {
    console.log(i, j);
    if (this.selectedClasses[i].divisions.length == 1) {
      this.selectedClasses = this.selectedClasses.slice(0, i).concat(this.selectedClasses.slice(i + 1, this.selectedClasses.length));
    }
    else {
      let len = this.selectedClasses[i].divisions.length;
      this.selectedClasses[i].divisions = this.selectedClasses[i].divisions.slice(0, j).concat(this.selectedClasses[i].divisions.slice(j + 1, len));
    }
    this.unCheck(cla, div)
  }
  viewScheduleBack() {
    this.ngOnInit();
  }
}
