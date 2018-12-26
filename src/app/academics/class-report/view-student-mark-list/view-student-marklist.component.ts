import { Component, OnInit, OnChanges, Input, ViewContainerRef } from '@angular/core';
import { School, Class, Divisions, AcademicYear, ExamConfiguration, ExamSeries, ReportConfiguration } from '../../../management/school/school';
import { SchoolDataService } from '../../../management/school/school-data.service';
import { ExamService } from '../../exams/exam.service';
import { Exam } from '../../exams/exam';
import { ClassInfo, Subject, ConstituentSubject } from '../../classes/class-info';
import { Student } from '../../../student/student';
import { StudentScore } from '../../student-score/student-score';
import { StudentScoreService } from '../../student-score/student-score.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'view-student-marklist',
  templateUrl: './view-student-marklist.component.html',
  styleUrls: ['./view-student-marklist.component.css']
})
export class ViewStudentMarkListComponent implements OnChanges {
  ready: boolean = false;
  student_scores: any;
  all_exams: Exam[];
  school: School;
  editable: boolean;
  configuration: ReportConfiguration;
  selected_index: number;
  selected_cons_ind: number;
  @Input('selectedStudentIndex') student_id: number;
  @Input('selectedStudentList') student_list: Student[];
  @Input('examSeries') exam_series: ExamSeries[];
  @Input('selectedClass') selected_class: ClassInfo;
  @Input('selectedDivision') selected_division: string;

  constructor(private schoolDataService: SchoolDataService,
              private examService: ExamService,
              private studentScoreService: StudentScoreService,
              public toastr: ToastsManager,
              private vcr: ViewContainerRef,) {
                this.toastr.setRootViewContainerRef(vcr);
              }

  ngOnChanges() {
    this.ready = false;
    if (typeof this.student_id != 'undefined' &&
      typeof this.student_list != 'undefined' &&
      typeof this.exam_series != 'undefined' &&
      typeof this.selected_class != 'undefined' &&
      this.student_id != -1) {
      this.toastr.setRootViewContainerRef(this.vcr);
      console.log("[ngOnChanges] : ", this.student_id, this.student_list, this.exam_series, this.selected_class);
      this.school = this.schoolDataService.getSchool();
      this.configuration = this.school.academic_configuration.exam_configuration.report_configurations.find(config => {
         let conf = config.classes.find(cla => (cla.class_key == this.selected_class.class_info_key))
         if (typeof conf == 'undefined') return false;
         return true;
      })
      if (typeof this.configuration == 'undefined' || this.configuration == null) {
        setTimeout(() => {this.showNotification('warning', "Report Configuration is not ready for this class"); console.log('asdf');}, 500);
      }
      this.examService.getExamListByClass({class_key: this.selected_class.class_info_key}).then(res => {
        this.all_exams = res.filter(exam => (exam.division == this.selected_division));
        this.format();
      });
    }
  }

  format() {
    this.selected_index = this.selected_cons_ind = -1;
    this.ready = false;
    let index = 0;
    this.student_scores = [];
    this.studentScoreService.getStudentScore(this.student_list[this.student_id].student_key).then(scores => {
      this.selected_class.subjects.forEach(subject => {
        if (this.isConstituentSubject(subject.code, this.selected_class)) return;
        this.addSubjectScores(subject, index, scores);
        index ++;
      });
      console.log("[student_markList] : ", this.student_scores);
      this.ready = true;
    });
  }

  isConstituentSubject(code, selected_class = null) {
    let retval = false;
    selected_class.subjects.forEach(sub => {
      if (typeof sub.constituent_subjects == 'undefined' || sub.constituent_subjects.length == 0) {
        return;
      }
      if (typeof sub.constituent_subjects.find(sb => (sb.code == code)) == 'undefined')
        return;
      retval = true;
    });
    return retval;
  }

  hasConstituentSubject(code, selected_class = null) {
    let subject;
    subject = selected_class.subjects.find(sub => (sub.code == code));
    if (typeof subject == 'undefined' || typeof subject.constituent_subjects == 'undefined' || subject.constituent_subjects.length == 0) return false;
    return true;
  }
  
  addConsitutionSubjectSocre(cons_sub, exam, std_scores, scores: StudentScore[]) {
    let cur_exam = this.all_exams.find(x => (x.subject_code == cons_sub.code && x.series_code == exam.code));
    let scr = null;
    let score = scores.find(scr => (scr.exam_key == cur_exam.exam_key))
    if (typeof score == 'undefined' || score == null) {
      std_scores.push({
        institution_key: this.school.school_id,
        student_score_key: null,
        student_key: this.student_list[this.student_id].student_key,
        exam_key: cur_exam.exam_key,
        score: null,
        max_score: cur_exam.max_score,
        grade: cur_exam.division + '+',
        has_cons_sub: false,
        cons_sub: [],
        new: true,
        sub_name: this.getSubName(cons_sub.code),
        exam_code: exam.code
      })
      scr = null;
    }
    else {
      std_scores.push({
        institution_key: score.institution_key,
        student_score_key: score.student_score_key,
        student_key: score.student_key,
        exam_key: score.exam_key,
        score: score.score,
        max_score: score.max_score,
        grade: score.grade,
        has_cons_sub: false,
        cons_sub: [],
        new: false,
        sub_name: this.getSubName(cons_sub.code),
        exam_code: exam.code
      });
      scr = score.score;
    }
    return scr;
  }

  addSubjectScores(subject, index, scores: StudentScore[]) {
    let sub_codes: ConstituentSubject[] = [], j = 0;
    this.student_scores[index] = [];
    this.editable = false;
    if (typeof subject.constituent_subjects == 'undefined') sub_codes.push(subject.code);
    else {
      subject.constituent_subjects.forEach(sub => {
        sub_codes.push(sub);
      })
    }
    sub_codes.forEach(cons_sub => {
      this.student_scores[index].push({name: null, cons_sub_name: this.getSubName(cons_sub.code), scores: [], final_mark: null, num_of_cons: sub_codes.length});
      this.exam_series.forEach(exam => {
        if (this.hasConstituentSubject(cons_sub.code, this.selected_class)) {
          this.student_scores[index][j].scores.push({
            institution_key: this.school.school_id,
            student_key: this.student_list[this.student_id].student_key,
            student_score_key: null,
            exam_key: null,
            score: 0,
            max_score: 0,
            grade: null,
            cons_sub: [],
            exam_code: exam.code
          })
          let subj = this.selected_class.subjects.find(cla => (cla.code == cons_sub.code));
          let len = this.student_scores[index][j].scores.length - 1;
          let f = false;
          subj.constituent_subjects.forEach(sub => {
            let scr = this.addConsitutionSubjectSocre(sub, exam, this.student_scores[index][j].scores[len].cons_sub, scores);
            if (scr != null) {
              f = true;
              this.student_scores[index][j].scores[len].score += scr;
            }
          })
          if (!f) this.student_scores[index][j].scores[len].score = null;
        }
        else {
          this.addConsitutionSubjectSocre(cons_sub, exam, this.student_scores[index][j].scores, scores);
        }
      })
      this.calculateFinalMark(index, j);
      j ++;
    });
    this.student_scores[index][0].name = subject.name;
  }
  
  calculateFinalMark(index, j) {
    let scores = this.student_scores[index][j].scores.filter(score => (score.score != null));
    if (typeof scores == 'undefined') this.student_scores[index][j].final_mark = null;
    else {
      this.student_scores[index][j].final_mark = 0;
      let total_pcnt = 0;
      scores.forEach(score => {
        let config = null;
        if (typeof this.configuration != 'undefined' && this.configuration != null){
          config = this.configuration.exam_weightage_configuration.find(conf => (conf.exam_series_code == score.exam_code));
        }
        let weightage = 0;
        if (typeof config != 'undefined' && config != null)
          weightage = config.weightage;
        total_pcnt += weightage;
        this.student_scores[index][j].final_mark += (score.score * weightage);
      })
      this.student_scores[index][j].final_mark = Math.round(this.student_scores[index][j].final_mark / total_pcnt);
    }
  }

  validate(i, j, k, l = -1) {
    if (l == -1) {
      let score = this.student_scores[i][j].scores[k].score;
      let max_score = this.student_scores[i][j].scores[k].max_score;
      if (score != null) {
        if (score < 0) this.student_scores[i][j].scores[k].score = 0;
        else if (score > max_score) this.student_scores[i][j].scores[k].score = max_score;
      }
    }
    else {
      let score = this.student_scores[i][j].scores[k].cons_sub[l].score;
      let max_score = this.student_scores[i][j].scores[k].cons_sub[l].max_score;
      if (score != null) {
        if (score < 0) this.student_scores[i][j].scores[k].cons_sub[l].score = 0;
        else if (score > max_score) this.student_scores[i][j].scores[k].cons_sub[l].score = max_score;  
        let f = false;
        this.student_scores[i][j].scores[k].score = 0;
        this.student_scores[i][j].scores[k].cons_sub.forEach(subject => {
          if (subject.score != null) {
            f = true;
            this.student_scores[i][j].scores[k].score += subject.score;
          }
        })
        if (!f)
          this.student_scores[i][j].scores[k].score = null;
      } 
    }
    this.calculateFinalMark(i, j);
  }

  previousStudent() {
    this.student_id --;
    if (this.student_id == -1)
      this.student_id = this.student_list.length - 1;
    this.format();
  }

  nextStudent() {
    this.student_id ++;
    if (this.student_id == this.student_list.length)
      this.student_id = 0;
    this.format();
  }

  saveChanges() {
    this.editable = false;
    let index = 0;
    this.student_scores.forEach(student_score => {
      let j = 0;
      student_score.forEach(mark_list => {
        mark_list.scores.forEach(score => {
          if (score.score != null) {
            if (score.exam_key != null) {
              let scr: StudentScore = new StudentScore;
              this.insertScore(scr, score);
              if (score.new) {
                score.new = false;
                this.studentScoreService.addStudentScore(scr);
              }
              else
                this.studentScoreService.updateStudentScore(scr);
            }
            else {
              score.cons_sub.forEach(subject => {
                let scr: StudentScore = new StudentScore;
                this.insertScore(scr, subject);    
                console.log(scr);
                if (score.new) {
                  score.new = false;
                  this.studentScoreService.addStudentScore(scr);
                }
                else
                  this.studentScoreService.updateStudentScore(scr);          
              });
            }
          }
        })
        this.calculateFinalMark(index, j);
        j ++;
      })
      index ++;
    });
  }

  insertScore(scr, score) {
    scr.exam_key = score.exam_key;
    scr.grade = score.grade;
    scr.institution_key = score.institution_key;
    scr.max_score = score.max_score;
    scr.student_key = score.student_key;
    scr.score = score.score;
    if (!score.new)
      scr.student_score_key = score.student_score_key;
  }

  cancelChanges() {
    this.editable = false;
    (<any>$('#edit-mark-overlay')).remove();
    this.format();
  }

  getRollNo(num) {
    num ++;
    if (num >= 100) return num;
    if (num >= 10) return "0" + num;
    return "00" + num;
  }

  getSubName(sub_code) {
    return this.school.academic_configuration.subjects.filter(subject => (subject.code == sub_code))[0].name;
  }

  editMarks() {
    this.editable = true;
  }

  getTotalMarks(index) {
    let total_score = 0;
    this.student_scores[index].forEach(student_score => {
      if (!student_score.final_mark) return;
      total_score += student_score.final_mark;
    })
    return total_score ? total_score : 'XX';
  }

  getGrade(index) {
    let total_score = this.getTotalMarks(index);
    if (total_score == 'XX') return 'XX';
    let grade = this.configuration.grade_configuration.percentage_rules.find(rule => (total_score >= rule.from_percent && total_score <= rule.to_percent));
    if (typeof grade == 'undefined') return 'XX';
    return grade.grade;
  }

  openModal(modal_name, i, j) {
    switch (modal_name) {
      case "edit-mark-overlay":
        this.selected_index = i;
        this.selected_cons_ind = j;
        break;
    }
    (<any>$('#' + modal_name)).appendTo('body').modal();
  }

  closeModal() {
  	(<any>$('.modal')).modal('hide');
  }

  editConstitionSUbjectDone() {

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
