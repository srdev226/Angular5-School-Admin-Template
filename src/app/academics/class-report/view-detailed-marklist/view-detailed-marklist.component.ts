import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { School, Class, Divisions, AcademicYear, ExamConfiguration, ExamSeries } from '../../../management/school/school';
import { SchoolDataService } from '../../../management/school/school-data.service';
import { ExamService } from '../../exams/exam.service';
import { Exam } from '../../exams/exam';
import { ClassInfo } from '../../classes/class-info';
import { Student } from '../../../student/student';
import { StudentScore } from '../../student-score/student-score';
import { StudentScoreService } from '../../student-score/student-score.service';

@Component({
  selector: 'view-detailed-marklist',
  templateUrl: './view-detailed-marklist.component.html',
  styleUrls: ['./view-detailed-marklist.component.css']
})
export class ViewDetailedMarklistComponent implements OnChanges {
  exam_info: any;
  school: School;
  ready: boolean;
  marks_list: any;
  all_exams: Exam[];
  scores: number[][];
  class_average: number[];
  class_pcnt: number[];
  editable: boolean;
  exam_count: number;
  @Input('examSeries') exam_series: ExamSeries[];
  @Input('selectedExamId') cur_exam_id: number;
  @Input('selectedClass') selected_class: ClassInfo;
  @Input('studentList') student_list: Student[];
  @Input('selectedDivision') selected_division: string;
  constructor(private schoolDataService: SchoolDataService,
              private examService: ExamService,
              private studentScoreService: StudentScoreService,) { }



  ngOnChanges() {
    this.ready = false;
    console.log("[ngOnChanges] : ", this.exam_series, this.cur_exam_id, this.selected_class, this.student_list, this.selected_division);
    if (typeof this.exam_series != 'undefined' &&
        typeof this.cur_exam_id != 'undefined' &&
        typeof this.selected_class != 'undefined' &&
        typeof this.student_list != 'undefined' &&
        typeof this.selected_division != 'undefined' && 
        this.cur_exam_id != -1) {
      let index = 0;
      this.exam_info = [];
      this.school = this.schoolDataService.getSchool();
      let class_code = this.selected_class.class_info_key;
      this.selected_class.divisions.forEach(div => {
        if (div.code == this.selected_division) {
          this.selected_class.subjects.forEach(subject => {
            if (this.isConstituentSubject(subject.code, this.selected_class))
              return;
            this.exam_info.push([]);
            this.exam_info[index].push({class: class_code,
                                  division: div.code,
                                  subject_name: this.getSubName(subject.code),
                                  subject_code: subject.code,
                                  has_cons_sub: false
                                  });
            if (typeof subject.constituent_subjects != 'undefined' && subject.constituent_subjects.length > 0) {
              let i = 0;
              this.exam_info[index][0].has_cons_sub = true;
              this.exam_info[index][0].subject_code = "";
              subject.constituent_subjects.forEach(cons_sub => {
                this.exam_info[index].push({class: class_code,
                                  division: div.code,
                                  subject_name: this.getSubName(cons_sub.code),
                                  subject_code: cons_sub.code,
                                  has_cons_sub: false});
                if (i != 0) this.exam_info[index][0].subject_code += ", ";
                this.exam_info[index][0].subject_code += cons_sub.code;
                i ++;
              })
            }
            index ++;
          });
        }
      });
      this.getMarks();
      console.log(this.exam_info);
    }
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

  getMarks() {
    this.ready = false;
    this.editable = false;
    this.marks_list = [];
    this.scores = [];
    this.examService.getExamListByClass({class_key: this.selected_class.class_info_key}).then(res => {
      this.all_exams = res.filter(exam => (exam.division == this.selected_division && exam.series_code == this.exam_series[this.cur_exam_id].code));
      console.log(this.all_exams);
      for (let i = 0; i < this.student_list.length; i ++) {
        this.marks_list.push([]);
        this.scores.push([]);
        this.studentScoreService.getStudentScore(this.student_list[i].student_key).then(scores => {
          for (let j = 0; j < this.exam_info.length; j ++) {
            for (let k = 0; k < this.exam_info[j].length; k ++) {
              if (!this.exam_info[j][k].has_cons_sub) {
                let exam = this.all_exams.find(exam => (exam.subject_code == this.exam_info[j][k].subject_code));
                let score = scores.find(score => (score.student_key == this.student_list[i].student_key && score.exam_key == exam.exam_key));
                this.marks_list[i].push({
                  has_cons_sub: false, 
                  scores: []
                });
                if (typeof score == 'undefined' || score == null) {
                  this.marks_list[i][j].scores.push({
                    institution_key: this.school.school_id,
                    student_key: this.student_list[i].student_key,
                    exam_key: exam.exam_key,
                    score: null,
                    max_score: exam.max_score,
                    grade: exam.division + '+'
                  });
                }
                else {
                  this.marks_list[i][j].scores.push(score);
                }
              }
            }
            this.marks_list[i][j].has_cons_sub = this.exam_info[j][0].has_cons_sub;
            this.scores[i].push(null);
            this.scores[i][j] = this.getCellScore(this.marks_list[i][j]);
          }
          let avg = this.getAVG(i);
          let pcnt = this.getStudentPcnt(i);
          this.scores[i].push(avg);
          this.scores[i].push(pcnt);
          if (i == this.student_list.length - 1) {
            console.log(this.marks_list);
            setTimeout(() => {
              this.getClassAVG();
              this.getClassPcnt();
              this.exam_count = this.scores[0].length;
              this.ready = true
            }, 1000);
          }
        });
      }
    });
  }

  round(number) {
    return Math.round( number * 10 ) / 10
  }
  selectExam(index) {
    this.cur_exam_id = index;
    this.getMarks();
  }

  getCellScore(mark) {
    if (!mark.has_cons_sub)
      return mark.scores[0].score;
    else {
      let score = 0;
      let scores = mark.scores.filter(scr => (scr.score != null));
      if (typeof scores == 'undefined' || scores.length == 0) return null;
      scores.forEach(scr => {
        score += scr.score;
      });
      return this.round(score);
    }
  }

  getTotal(i) {
    let total = 0;
    let scores = this.scores[i].filter(scr => (scr != null));
    if (typeof scores == 'undefined' || scores.length == 0) return null;
    for (let j = 0; j < scores.length; j ++) {
      total += scores[j];
    }
    return total;
  }

  getAVG(i) {
    // let total_max_score = 0;
    // this.marks_list[i].forEach(mark => {
    //   mark.scores.forEach(score => {
    //     total_max_score += score.max_score;
    //   })
    // });
    let total = this.getTotal(i);
    return total == null ? null : this.round(total / (this.scores[i].length));
  }

  getStudentPcnt(i) {
    let total_max_score = 0;
    this.marks_list[i].forEach(mark => {
      mark.scores.forEach(score => {
        total_max_score += score.max_score;
      })
    });
    let total = this.getTotal(i);
    return total == null ? null : this.round(this.getTotal(i) * 100 / total_max_score);
  }

  getAVGCell(i) {
    let avg = this.scores[i][this.scores[i].length - 2];
  }

  getStudentPcntCell(i) {
    let pcnt = this.scores[i][this.scores[i].length - 1];
  }

  getSubjectTotal(j) {
    let total = 0;
    let scores = this.scores.filter(score => (score[j] != null));
    if (typeof scores == 'undefined' || scores.length == 0) return null;
    this.scores.forEach(score => {
      if (score[j] == null) return;
      total += score[j];
    })
    return total;
  }

  getClassAVG() {
    this.class_average = [];
    for (let j = 0; j < this.scores[0].length; j ++) {
      let total = this.getSubjectTotal(j);
      if (total == null) this.class_average.push(null);
      else this.class_average.push(this.round(total / this.scores.length));
    }
  }

  getClassPcnt() {
    this.class_pcnt = [];
    for (let j = 0; j < this.scores[0].length - 2; j ++) {
      let avg = this.class_average[j];
      if (avg == null) this.class_pcnt.push(null);
      else {
        let max_score = 0;
        this.marks_list[0][j].scores.forEach(score => {
          max_score += score.max_score;
        })
        this.class_pcnt.push(this.round(<any>avg / max_score * 100));
      }
    }
  }

  getAVGAVG() {
    return 'XX';
  }

  getAVGPcnt() {
    return 'XX';
  }

  getStudentPcntAVG() {
    return 'XX';
  }

  getStudentPcntPcnt() {
    return 'XX';
  }

  getSubName(sub_code) {
    return this.school.academic_configuration.subjects.filter(subject => (subject.code == sub_code))[0].name;
  }

  editMarks() {
    this.editable = true;
  	this.openModal('edit-mark-overlay');
  }

  openModal(modal_name) {
    (<any>$('#' + modal_name)).appendTo('body').modal();
  }

  closeModal() {
  	(<any>$('.modal')).modal('hide');
  }
}
