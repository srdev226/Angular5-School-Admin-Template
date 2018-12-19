import { Component, OnInit } from '@angular/core';
import { ClassInfoService} from '../../classes/class-info.service';
import { School, Class, Divisions, AcademicYear, ExamConfiguration, ExamSeries } from '../../../management/school/school';
import { SchoolDataService } from '../../../management/school/school-data.service';
import { EmployeeService } from '../../../employees/employee.service';
import { Employee } from '../../../employees/employee';
import { StudentService } from '../../../student/student.service';
import { Student } from '../../../student/student';
import { ExamService } from '../../exams/exam.service';
import { Exam } from '../../exams/exam';
import { ClassInfo } from '../../classes/class-info';

class ReportCardConfiguration {
  academic_year: AcademicYear;
  classes: SelectedClassInfo[];
}

class SelectedClassInfo {
  is_selected: boolean;
  class_info: ClassInfo;
}

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
  current_classes: ClassInfo[];
  all_configurations: ReportCardConfiguration[];

  constructor(private classInfoService: ClassInfoService,
              private schoolDataService: SchoolDataService,) { }

  ngOnInit() {
    this.all_configurations = [];
    this.school = this.schoolDataService.getSchool();
    this.academic_years = this.school.academic_years;
    this.format();
  }

  format() {
    this.classInfoService.getClassInfoList(this.school.school_id).then(resp => {
      this.all_classes = resp.filter(cla => (cla.type == 'regular'));
      this.all_classes.sort(function(a,b){
        return (a.order_index) - (b.order_index);
      });
      this.addNewConfiguration();
    })
  }
  
  addNewConfiguration() {
    let academic_year = this.schoolDataService.getCurrentAcademicYear();
    this.all_configurations.push({
      academic_year: academic_year,
      classes: [],
    })
    this.formatConfigurationClasses(this.all_configurations.length - 1, this.all_classes.filter(cla => (cla.academic_year == academic_year.code)));
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
    this.all_configurations[index].academic_year = academic_year;
    this.formatConfigurationClasses(index, this.all_classes.filter(cla => (cla.academic_year == academic_year.code)));
  }

  getSelectedClassesCodes(index) {
    let retval = '';
    let selected_classes = this.all_configurations[index].classes.filter(cla => (cla.is_selected  == true));
    if (typeof selected_classes == 'undefined' || selected_classes.length == 0) return 'Select Class';
    for (let i = 0; i < selected_classes.length; i ++) {
      if (i > 5) continue;
      if (i == 5) {
        retval += '..';
        continue;
      }
      if (i != 0) retval += ', ';
      retval += 'Class ' + selected_classes[i].class_info.name;
    }
    return retval;
  }

  toggleClassSelection(i, j) {
    this.all_configurations[i].classes[j].is_selected = !this.all_configurations[i].classes[j].is_selected;
  }

  viewOverlayBack() {
  	this.openModal('warning-modal');
  }

  openModal(modal_name) {
    (<any>$('#' + modal_name)).appendTo('body').modal();
  }

  closeModal() {
  	(<any>$('.modal')).modal('hide');
  }

  saveChanges() {
    this.saveConfiguration();
    this.closeModal();
  }

  saveConfiguration() {

  }

  cancelChanges() {

  }
  
  closeWithoutSaving() {
    this.closeModal();
  }

  setDropDown() {
    $('.check-dropdown li').on('click', function (event) {
      console.log(111);
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
}
