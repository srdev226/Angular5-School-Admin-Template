import { Component, OnChanges, ViewContainerRef, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { School, Class, Divisions, AcademicYear, ExamConfiguration, ExamSeries } from '../../../management/school/school';
import { SchoolDataService } from '../../../management/school/school-data.service';
import { ClassInfoService} from '../../classes/class-info.service';
import { Student } from '../../../student/student';
import { StudentService } from '../../../student/student.service';
import { StudentScore } from '../../student-score/student-score';
import { StudentScoreService } from '../../student-score/student-score.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ExamService } from '../exam.service';
import { Exam } from '../exam';

@Component({
  selector: 'mark-students',
  templateUrl: './mark-students.component.html',
  styleUrls: ['./mark-students.component.css']
})
export class MarkStudentsComponent implements OnChanges {
	selected_test: any;
  all_exams: Exam[] = [];
  school: School;
  student_list: Student[];
  exam_series: ExamSeries[];
  exams: any;
  status: any;
  is_details_loaded: boolean;
  selected_max_mark: number;
  class_name: string;
  subject_name: string;
  selected_exam_index: number;
  @Input('classKey') class_key: string;
  @Input('division') division: string;
  @Input('subjectCode') subject_code: string;
  @Input('studentList') all_student_list: Student[];
  @Input('changed') changed: number;

  constructor(private schoolDataService: SchoolDataService,
        private route: ActivatedRoute,
        private classInfoService : ClassInfoService,
        private examService: ExamService,
        private studentService: StudentService,
        private studentScoreService: StudentScoreService,
        public toastr: ToastsManager,
        private vcr: ViewContainerRef,) {}

  ngOnChanges() {
    console.log('[MarkStudentsComponent] ngOnChanges ',this.class_key, this.subject_code, this.division);
  	if (typeof this.class_key != 'undefined' && typeof this.division != 'undefined' && typeof this.subject_code != 'undefined' && typeof this.all_student_list != 'undefined') {
      this.format();
    }
  }

  format() {
    let index = 0;
    this.is_details_loaded = false;
    this.exams = [];
    this.status = [];
    this.all_exams = [];
    this.toastr.setRootViewContainerRef(this.vcr);
    this.school = this.schoolDataService.getSchool();
    this.classInfoService.getClassInfoList(this.school.school_id).then(resp => {
      let cla = resp.filter(x => (x.class_info_key == this.class_key))[0];
      this.class_name = cla.name.toUpperCase() + ' ' + this.division;
      cla.subjects.forEach(subject => {
        if (subject.code == this.subject_code) {
          this.subject_name = subject.name.toUpperCase();
        }
      });
    });
    this.exam_series = this.school.academic_configuration.exam_configuration.exam_series;
    this.examService.getExamListByClass({class_key: this.class_key}).then(res => {
      console.log(res);
      this.exam_series.forEach(exam => {
        res.forEach(x => {
          if (x.division == this.division){
            if (x.subject_code == this.subject_code && exam.code == x.series_code)
              this.all_exams.push(x);
          }
        });
      });
      // this.all_exams = res.filter(x => {
      //   if (x.subject_code == this.subject_code)
      //     return true;
      //   return false;
      //   let ex = this.exam_series.filter(exam => (exam.code == x.series_code));
      //   console.log(ex, x.series_code);
      //   if (typeof ex == 'undefined' || ex.length == 0) return false;
      //   return true;
      // });
      console.log(this.all_exams);
      this.student_list = this.all_student_list.filter(student => (student.current_class_key == this.class_key));
      this.all_exams.forEach(exam => {
         this.status.push(this.exam_series.filter(x => (x.code == exam.series_code))[0].results_publish);
      });
      let std_len = this.student_list.length;
      for (let i = 0; i < std_len; i ++) {
        this.exams.push([]);
        this.studentScoreService.getStudentScore(this.student_list[i].student_key).then(res => {
          this.all_exams.forEach(exam => {
            let score = res.filter(x => (x.exam_key === exam.exam_key));
            if (typeof score == 'undefined' || score.length == 0) {
              this.exams[i].push({
                  new: true,
                  exam: {
                    institution_key: this.school.school_id,
                    student_key: this.student_list[i].student_key,
                    exam_key: exam.exam_key,
                    score: null,
                    max_score: exam.max_score,
                    grade: exam.division + '+'
                  }
                });
            }
            else {
              console.log(score[0].score, this.student_list[i].student_key, this.student_list[i].full_name);
              this.exams[i].push({new: false, exam: score[0]});
            }
          });
          if (i == std_len - 1)
            setTimeout(() => (this.is_details_loaded = true), 500);
        });
      }
      console.log(this.student_list, this.exams);
    });
  }

  openModal(modal_name, code = -1, i, max_mark) {
  	switch (modal_name) {
  		case "edit-max-mark":
        if (!this.status[i]) return;
        this.selected_exam_index = i;
  			this.selected_test = code;
        this.selected_max_mark = max_mark;
  			break;

  		default:
  			// code...
  			break;
  	}
    (<any>$('#' + modal_name)).appendTo('body').modal();
  }

  getRollNo(num) {
    num ++;
    if (num >= 100) return num;
    if (num >= 10) return "0" + num;
    return "00" + num;
  }

  saveMarks() {
    console.log('[MarkStudentsComponent] Saving marks ',this.exams);
    let res = true, index = 0;
    let available_scores: any = [];
    this.exams.forEach(student => {
      student.forEach(score => {
        if (score.exam.score != null)
          available_scores.push(score);
      });
    });
    console.log(available_scores);
    available_scores.forEach(score => {
      if (score.new)
        this.studentScoreService.addStudentScore(score.exam).then(data => {
          index ++;
          if (index == available_scores.length && res) {
            this.showNotification('success', "Marks have been successfully saved!");
          }
        }).catch(() => {
          res = false;
          this.showNotification('error!', "Cannot save marks");
        });
      else
        this.studentScoreService.updateStudentScore(score.exam).then(data => {
          index ++;
          if (index == available_scores.length && res) {
            this.showNotification('success', "Marks have been successfully saved!");
          }
        }).catch(() => {
          res = false;
          this.showNotification('error!', "Cannot save marks");
        });
      
    });
  }

  validate(i, j, max_score) {
    let score = this.exams[i][j].exam.score;
    if (score == null) return;
    if (score > max_score)
     this.exams[i][j].exam.score = max_score;
    else if (score < 0) this.exams[i][j].exam.score = 0;
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

  selectMaxMark(mark) {
    this.selected_max_mark = mark;
  }

  closeModal(modal_name) {
    (<any>$('#' + modal_name)).modal('hide');
  }

  updateMaxMark() {
    this.all_exams[this.selected_exam_index].max_score = this.selected_max_mark;
    this.examService.updateExam(this.all_exams[this.selected_exam_index]).then(res => {
      for (let i = 0; i < this.exams.length; i ++) {
        this.validate(i, this.selected_exam_index, this.selected_max_mark);
      }
      this.closeModal('edit-max-mark');
    });
  }
}
