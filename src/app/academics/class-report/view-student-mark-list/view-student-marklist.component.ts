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
  @Input('selectedStudentIndex') student_id: number;
  @Input('selectedStudentList') student_list: Student[];
  @Input('examSeries') exam_series: ExamSeries[];
  @Input('selectedClass') selected_class: ClassInfo;
  @Input('selectedDivision') selected_division: string;

  constructor(private schoolDataService: SchoolDataService,
              private examService: ExamService,
              private studentScoreService: StudentScoreService,) { }

  ngOnChanges() {
    this.ready = false;
    if (typeof this.student_id != 'undefined' &&
      typeof this.student_list != 'undefined' &&
      typeof this.exam_series != 'undefined' &&
      typeof this.selected_class != 'undefined' &&
      this.student_id != -1) {
      console.log("[ngOnChanges] : ", this.student_id, this.student_list, this.exam_series, this.selected_class);
      this.school = this.schoolDataService.getSchool();
      this.examService.getExamListByClass({class_key: this.selected_class.class_info_key}).then(res => {
        this.all_exams = res.filter(exam => (exam.division == this.selected_division));
        this.format();
      });
    }
  }

  format() {
    this.ready = false;
    let index = 0;
    this.student_scores = [];
    this.studentScoreService.getStudentScore(this.student_list[this.student_id].student_key).then(scores => {
      this.selected_class.subjects.forEach(subject => {
        if (typeof subject.selected != 'undefined' && subject.selected == true) return;
        console.log(subject);
        this.addSubjectScores(subject, index, scores);
        index ++;
      });
      console.log("[student_markList] : ", this.student_scores);
      this.ready = true;
    });
  }

  addSubjectScores(subject, index, scores: StudentScore[]) {
    let sub_codes: string[] = [], j = 0;
    this.student_scores[index] = [];
    this.editable = false;
    if (typeof subject.constituent_subjects == 'undefined') sub_codes.push(subject.code);
    else {
      subject.constituent_subjects.forEach(sub => {
        sub_codes.push(sub);
      })
    }
    sub_codes.forEach(code => {
      this.student_scores[index].push({name: null, cons_sub_name: this.getSubName(code), scores: [], num_of_cons: sub_codes.length});
      this.exam_series.forEach(exam => {
        let cur_exam = this.all_exams.find(x => (x.subject_code == code && x.series_code == exam.code));
        let score = scores.find(scr => (scr.exam_key == cur_exam.exam_key))
        if (typeof score == 'undefined' || score == null) {
          this.student_scores[index][j].scores.push({
            institution_key: this.school.school_id,
            student_key: this.student_list[this.student_id].student_key,
            exam_key: cur_exam.exam_key,
            score: null,
            max_score: cur_exam.max_score,
            grade: cur_exam.division + '+'
          })
        }
        else {
          this.student_scores[index][j].scores.push(score);
        }
      })
      j ++;
    });
    this.student_scores[index][0].name = subject.name;
  }
  
  validate(i, j, k) {
    let score = this.student_scores[i][j].scores[k].score;
    let max_score = this.student_scores[i][j].scores[k].max_score;
    if (score == null) return;
    if (score < 0) this.student_scores[i][j].scores[k].score = 0;
    else if (score > max_score) this.student_scores[i][j].scores[k].score = max_score;
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
  }

  cancelChanges() {
    this.editable = false;
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

  openModal(modal_name) {
    (<any>$('#' + modal_name)).appendTo('body').modal();
  }

  closeModal() {
  	(<any>$('.modal')).modal('hide');
  }
}
