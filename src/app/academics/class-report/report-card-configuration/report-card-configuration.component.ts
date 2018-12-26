import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ClassInfoService} from '../../classes/class-info.service';
import { School, Class, Divisions, AcademicYear, ExamConfiguration, ExamSeries, ReportConfiguration, GradeConfiguration } from '../../../management/school/school';
import { SchoolDataService } from '../../../management/school/school-data.service';
import { SchoolService } from '../../../management/school/school.service';
import { EmployeeService } from '../../../employees/employee.service';
import { Employee } from '../../../employees/employee';
import { StudentService } from '../../../student/student.service';
import { Student } from '../../../student/student';
import { ExamService } from '../../exams/exam.service';
import { Exam } from '../../exams/exam';
import { ClassInfo } from '../../classes/class-info';
import { ReportCardConfiguration } from './report-card-configuration';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'report-card-configuration',
  templateUrl: './report-card-configuration.component.html',
  styleUrls: ['./report-card-configuration.component.css']
})
export class ReportCardConfigurationComponent implements OnInit {
  selected_classes_txt: string;
  selected_academic_year: AcademicYear;
  school: School;
  academic_years: AcademicYear[];
  all_classes: ClassInfo[];
  all_exams: ExamSeries[];
  current_classes: ClassInfo[];
  all_configurations: ReportCardConfiguration[];
  is_details_loaded: boolean;
  current_configuration: ReportConfiguration[];
  is_editing: boolean;
  editing_config_id: number;
  is_new: boolean;
  is_changed: boolean;
  cancel_type: number;
  constructor(private classInfoService: ClassInfoService,
              private schoolDataService: SchoolDataService,
              private schoolService: SchoolService,
              public toastr: ToastsManager,
              private vcr: ViewContainerRef,) {
                this.toastr.setRootViewContainerRef(vcr);
              }

  ngOnInit() {
    this.toastr.setRootViewContainerRef(this.vcr);
    this.is_editing = false;
    this.is_changed = false;
    this.is_new = false;
    this.cancel_type = 0;
    this.editing_config_id = -1;
    this.is_details_loaded = false;
    this.all_configurations = [];
    this.school = this.schoolDataService.getSchool();
    this.academic_years = this.school.academic_years;
    this.format();
  }

  format() {
    this.classInfoService.getClassInfoList(this.school.school_id).then(resp => {
      this.all_classes = resp.filter(cla => (cla.type == 'regular'));
      this.all_exams = this.school.academic_configuration.exam_configuration.exam_series;
      this.all_classes.sort(function(a,b){
        return (a.order_index) - (b.order_index);
      });
      this.current_configuration = this.school.academic_configuration.exam_configuration.report_configurations;
      this.all_configurations = [];
      // if (typeof this.current_configuration == undefined || this.current_configuration.length == 0)
      //   this.addNewConfiguration();
      // else {
        let index = 0;
        this.current_configuration.forEach(config => {
          this.all_configurations.push(null);
          this.setConfiguration(index, config);
          index ++;
        })
      // }
      this.is_details_loaded = true;
    })
  }
  
  setConfiguration(index, config) {
    let default_data: ReportCardConfiguration = {
      academic_year: this.school.academic_configuration.code,
      classes: [],
      grade_rules: [],
      mark_distribution: []
    };
    config.grade_configuration.percentage_rules.forEach(grade_config => {
      default_data.grade_rules.push({
        percentage_from: grade_config.from_percent,
        percentage_to: grade_config.to_percent,
        letter_grade: grade_config.grade
      })
    });
    config.exam_weightage_configuration.forEach(weight_config => {
      default_data.mark_distribution.push({
        exam: this.all_exams.find(exam => (exam.code == weight_config.exam_series_code)),
        percentage_weightage: weight_config.weightage
      })
    })
    this.all_configurations[index] = default_data;
    this.formatConfigurationClasses(index, this.all_classes.filter(cla => (cla.academic_year == default_data.academic_year)))
    config.classes.forEach(cla => {
      this.all_configurations[index].classes.forEach(x => {
        if (x.class_info.class_info_key == cla.class_key)
          x.is_selected = true;
      });
    })
  }

  addNewConfiguration(index = -1) {
    let academic_year = this.schoolDataService.getCurrentAcademicYear();
    let default_data: ReportCardConfiguration = {
        academic_year: academic_year.code,
        classes: [],
        grade_rules: [{
          percentage_from: null,
          percentage_to: 100,
          letter_grade: null,
        }],
        mark_distribution: [{
          exam: null,
          percentage_weightage: null
        }]
      };
    this.is_new = false;
    if (index == -1) {
      this.all_configurations.push(default_data);
      index = this.all_configurations.length - 1;
      this.is_new = true;
    }
    else {
      this.all_configurations[index] = default_data;
    }
    this.formatConfigurationClasses(index, this.all_classes.filter(cla => (cla.academic_year == academic_year.code)));
    this.is_editing = true;
    this.editing_config_id = index;
    this.is_changed = true;
    this.waitingScreen();
  }

  getExamTxt(exam) {
    if (exam == null) return 'Select Exam';
    return exam.name;
  }

  onSelectExamName(i, j, exam) {
    this.is_changed = true;
    this.all_configurations[i].mark_distribution[j].exam = exam;
  }

  onChangePercentageWeightage(i, j) {
    this.is_changed = true;
    let pcnt = this.all_configurations[i].mark_distribution[j].percentage_weightage;
    if (pcnt == null) return;
    this.all_configurations[i].mark_distribution[j].percentage_weightage = pcnt > 100 ? 100 : (pcnt < 0 ? 0 : pcnt);
  }

  AddExam(index) {
    this.is_changed = true;
    this.all_configurations[index].mark_distribution.push({
      exam: null,
      percentage_weightage: null,
    });
  }

  removeExam(i, j) {
    this.is_changed = true;
    this.all_configurations[i].mark_distribution = this.all_configurations[i].mark_distribution.slice(0, j).concat(this.all_configurations[i].mark_distribution.slice(j + 1));
  }

  getSumOfPcntWeightageOfExams(index) {
    let mark_distribution = this.all_configurations[index].mark_distribution.filter(mark_dist => (mark_dist.exam != null && mark_dist.percentage_weightage != null));
    if (mark_distribution.length == 0) return 'Sum of % Weightage of Exams';
    let retval = '';
    for (let i = 0; i < mark_distribution.length; i ++) {
      if (i != 0) retval += ' + ';
      retval += mark_distribution[i].percentage_weightage + '% ' + mark_distribution[i].exam.name;
    }
    return retval;
  }

  formatConfigurationClasses(index, class_infos) {
    this.all_configurations[index].classes = [];
    class_infos.forEach(class_info => {
      this.all_configurations[index].classes.push({is_selected: false, class_info: class_info});
    })
    setTimeout(() => {this.setDropDown()}, 300);
  }

  selectYear(index, academic_year) {
    if (this.all_configurations[index].academic_year == academic_year) return;
    this.is_changed = true;
    this.all_configurations[index].academic_year = academic_year;
    this.formatConfigurationClasses(index, this.all_classes.filter(cla => (cla.academic_year == academic_year.code)));
  }

  getSelectedClassesCodes(index) {
    let retval = '';
    let selected_classes = this.all_configurations[index].classes.filter(cla => (cla.is_selected  == true));
    if (typeof selected_classes == 'undefined' || selected_classes.length == 0) return 'Select Class';
    for (let i = 0; i < selected_classes.length; i ++) {
      if (i > 4) continue;
      if (i == 4) {
        retval += '..';
        continue;
      }
      if (i != 0) retval += ', ';
      retval += 'Class ' + selected_classes[i].class_info.name;
    }
    return retval;
  }

  addAnotherRule(index) {
    this.is_changed = true;
    let len = this.all_configurations[index].grade_rules.length;
    this.all_configurations[index].grade_rules.push({
      percentage_from: null,
      percentage_to: (this.all_configurations[index].grade_rules[len - 1].percentage_from * 10 - 1) / 10,
      letter_grade: null,
    });
  }

  onChangePercentageFrom(index) {
    this.is_changed = true;
    let grade_rules = this.all_configurations[index].grade_rules;
    for (let i = 0; i < grade_rules.length; i ++) {
      if (grade_rules[i].percentage_from < 0) grade_rules[i].percentage_from = 0;
      if (i > 0) 
        grade_rules[i].percentage_to = grade_rules[i - 1].percentage_from == null ? null : (grade_rules[i - 1].percentage_from * 10 - 1) / 10;
      if (grade_rules[i].percentage_from >= grade_rules[i].percentage_to) grade_rules[i].percentage_from = grade_rules[i].percentage_to;
    }
  }

  getColumnForGradeRules(index, no) {
    let len = this.all_configurations[index].grade_rules.length;
    len = len <= 8 ? 4 : (len + 1) / 2;
    if (no == 1)
      return this.all_configurations[index].grade_rules.slice(0, len);
    else
      return this.all_configurations[index].grade_rules.slice(len);
  } 

  deleteClass(i, j) {
    this.is_changed = true;
    this.all_configurations[i].classes[j].is_selected = !this.all_configurations[i].classes[j].is_selected;
  }

  toggleClassSelection(i, j) {
    this.is_changed = true;
    this.all_configurations[i].classes[j].is_selected = !this.all_configurations[i].classes[j].is_selected;
  }

  viewOverlayBack() {
  	this.closeModal();
  }

  editBack() {
    this.cancel_type = 0;
    if (this.is_changed == true)
      this.openModal('warning-modal');
    else {
      this.is_editing = false;
      this.waitingScreen();
    }
  }

  openModal(modal_name) {
    (<any>$('#' + modal_name)).appendTo('body').modal();
  }

  closeModal() {
  	(<any>$('.modal')).modal('hide');
    setTimeout(() => {(<any>$('#warning-modal')).remove()}, 300);
  }  

  saveChanges() {
    for (let i = 0; i < this.all_configurations.length; i ++) {
      if (i == this.all_configurations.length - 1)
        this.saveConfiguration(i, true, true);
      else this.saveConfiguration(i, false)
    }
  }

  saveConfiguration(index, end = true, close = false) {
    let report_configuration: ReportConfiguration = new ReportConfiguration;

    report_configuration.classes = [];
    this.all_configurations[index].classes.forEach(cla => {
      if (cla.is_selected)
        report_configuration.classes.push({class_key: cla.class_info.class_info_key});
    });

    report_configuration.grade_configuration = new GradeConfiguration;
    report_configuration.grade_configuration.percentage_rules = [];
    this.all_configurations[index].grade_rules.forEach(grade_rule => {
      let ind = grade_rule.letter_grade.indexOf('[');
      if (ind < 0) ind = grade_rule.letter_grade.length;
      let grade = grade_rule.letter_grade.slice(0, ind); 
      report_configuration.grade_configuration.percentage_rules.push({
        from_percent: grade_rule.percentage_from,
        to_percent: grade_rule.percentage_to,
        grade: grade,
      });
    });

    report_configuration.exam_weightage_configuration = [];
    this.all_configurations[index].mark_distribution.forEach(mark_dist => {
      report_configuration.exam_weightage_configuration.push({
        weightage: mark_dist.percentage_weightage,
        exam_series_code: mark_dist.exam.code,
      });
    });

    if (typeof this.school.academic_configuration.exam_configuration.report_configurations == 'undefined')
      this.school.academic_configuration.exam_configuration.report_configurations = [];
    if (index >= this.school.academic_configuration.exam_configuration.report_configurations.length)
      this.school.academic_configuration.exam_configuration.report_configurations.push(report_configuration);
    else this.school.academic_configuration.exam_configuration.report_configurations[index] = report_configuration;
    if (end) {
      console.log(this.school.academic_configuration.exam_configuration.report_configurations);
      this.schoolService.updateSchool(this.school).then(res => {
        this.schoolDataService.setSchool(this.school);
        this.showNotification('success', "Report Configuration has been successfully saved!");
        this.is_changed = false;
        if (close) {
          setTimeout(() => {this.is_editing = false; this.waitingScreen();}, 2000);
        }
      }).catch(res => {
        this.showNotification('error', "Error occurred while saving to database."); 
      });
    }
  }

  cancel(i, type) {
    this.cancel_type = type;
    if (this.is_changed == true)
      this.openModal('warning-modal');
  }

  cancelChanges() {
    let index = this.editing_config_id;
    if (index >= this.school.academic_configuration.exam_configuration.report_configurations.length)
      this.addNewConfiguration(index);
    else this.setConfiguration(index, this.current_configuration[index]);
    this.is_changed = false;
  }
  
  closeWithoutSaving() {
    this.cancelChanges();
    if (this.editing_config_id >= this.school.academic_configuration.exam_configuration.report_configurations.length) {
      console.log('aaa');
      this.all_configurations = this.all_configurations.slice(0, this.all_configurations.length - 1);
    }
    this.is_editing = false;
    this.waitingScreen();
  }

  addAnotherConfiguration() {
    this.addNewConfiguration();  
  }

  editConfiguration(i) {
    this.editing_config_id = i;
    this.is_editing = true;
    this.is_new = false;
    this.is_changed = false;
    this.waitingScreen();
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

  public waitingScreen() {
    this.is_details_loaded = false;
    setTimeout(() => {
      this.is_details_loaded = true;
      (<any>$('#warning-modal')).remove();
      setTimeout(() => {this.setDropDown();}, 300);
    }, 500);
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
}
