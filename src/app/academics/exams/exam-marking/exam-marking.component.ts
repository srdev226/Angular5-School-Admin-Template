import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { School, Class, Divisions, AcademicYear, ExamConfiguration, ExamSeries } from '../../../management/school/school';
import { SchoolDataService } from '../../../management/school/school-data.service';
import { ClassInfoService} from '../../classes/class-info.service';
import { ClassInfo, Division, ClassTeacher, Subject as ClassSubject } from '../../classes/class-info';
import { Student } from '../../../student/student';
import { StudentService } from '../../../student/student.service';

@Component({
	selector: 'exam-marking',
	templateUrl: 'exam-marking.component.html',
	styleUrls: ['exam-marking.component.css'],
})
export class ExamMarkingComponent implements OnInit {
  examSeries: ExamSeries;
  school: School;
  exam_key: string;
  cur_aca_year: string;
  exam_infos: any;
  class_infos: ClassInfo[];
  is_details_loaded = false;
  selAll = true;
  selected_class_key;
  selected_sub_code;
  selected_division;
  student_list;
  changed = 0;
	constructor(private schoolDataService: SchoolDataService,
              private router: Router,
              private route: ActivatedRoute,
              private studentService: StudentService,
              private classInfoService: ClassInfoService,
              ) {}

	ngOnInit() {
    this.school = this.schoolDataService.getSchool();
    this.exam_key = this.route.snapshot.params['exam_code'];
    this.cur_aca_year = this.route.snapshot.params['academic_year'];
    this.examSeries = this.school.academic_configuration.exam_configuration.exam_series.filter(exam => (exam.code == this.exam_key))[0];
    this.classInfoService.getClassInfoList(this.school.school_id).then(resp => {
      this.class_infos = resp;
      this.class_infos = this.class_infos.filter(x => (x.type === "regular" && x.academic_year == this.cur_aca_year));
      this.is_details_loaded = !this.is_details_loaded;
      this.getExamInfos();
    });
    this.studentService.getStudentList(this.schoolDataService.getSchool().school_id).then(resp => {
      this.student_list = resp;
    });
	}

  getClassCode(class_key) {
    return this.class_infos.filter(cla => (cla.class_info_key == class_key))[0].class_code;
  }

  getClassInfoKey(class_key) {
    console.log(this.class_infos.filter(cla => (cla.class_code == class_key))[0]);
    return this.class_infos.filter(cla => (cla.class_code == class_key))[0].class_info_key;
  }

  getExamInfos() {
    let index = 0, k = 0;
    this.exam_infos = [];
    this.examSeries.classes.forEach(cla => {
      this.exam_infos.push({exam_info: [], checked: true});
      index = 0;
      let class_code = this.getClassCode(cla.class_key);
      this.class_infos.forEach(class_info => {
        if (class_info.class_info_key == cla.class_key) {
          class_info.divisions.forEach(div => {
            if (div.code == cla.division) {
              class_info.subjects.forEach(subject => {
                if (typeof subject.selected != 'undefined' && subject.selected == true){
                  return;
                }
                this.exam_infos[k].exam_info.push([]);
                this.exam_infos[k].exam_info[index].push({class: class_code,
                                      division: div.code,
                                      subject_name: this.getSubName(subject.code),
                                      subject_code: subject.code,
                                      has_cons_sub: false
                                      });
                if (typeof subject.constituent_subjects != 'undefined' && subject.constituent_subjects.length > 0) {
                  let i = 0;
                  this.exam_infos[k].exam_info[index][0].has_cons_sub = true;
                  this.exam_infos[k].exam_info[index][0].subject_code = "";
                  subject.constituent_subjects.forEach(cons_sub => {
                    this.exam_infos[k].exam_info[index].push({class: class_code,
                                      division: div.code,
                                      subject_name: this.getSubName(cons_sub),
                                      subject_code: cons_sub,
                                      has_cons_sub: false});
                    if (i != 0) this.exam_infos[k].exam_info[index][0].subject_code += ", ";
                    this.exam_infos[k].exam_info[index][0].subject_code += cons_sub;
                    i ++;
                  })
                }
                index ++;
              });
            }
          })
        }
      });
      k ++;
    });
    setTimeout(() => {this.setDropDown()}, 1000);
  }

	addNewSubject() {

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

  getSubName(sub_code) {
    return this.school.academic_configuration.subjects.filter(subject => (subject.code == sub_code))[0].name;
  }

  openModal(modal_name) {
    (<any>$('#' + modal_name)).appendTo('body').modal();
  }

  markStudents(class_name, sub_code, division) {
		this.selected_class_key = this.getClassInfoKey(class_name);
    this.selected_sub_code = sub_code;
    this.selected_division = division;
    this.changed ++;
    this.openModal('mark-students-overlay');
  }

  selectAll() {
    this.selAll = !this.selAll;
    if (this.selAll == true) {
      this.exam_infos.forEach(exam_info => {
        exam_info.checked = true;
      });
    }
    else {
      this.exam_infos.forEach(exam_info => {
        exam_info.checked = false;
      })
    }
  }

  onCheckboxSelect(index) {
    this.selAll = true;
    this.exam_infos[index].checked = !this.exam_infos[index].checked;
    this.exam_infos.forEach(exam_info => {
      if (exam_info.checked == false) {
        this.selAll = false;
        return;
      }
    });
  }

  removeFilter(index) {
    this.exam_infos[index].checked = false;
  }

  clearFilters() {
    this.selAll = true;
    this.exam_infos.forEach(exam_info => {
      exam_info.checked = true;
    });
  }
}
