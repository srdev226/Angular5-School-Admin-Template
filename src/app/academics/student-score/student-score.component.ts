import { Component, OnInit } from '@angular/core';
import { Pipe,PipeTransform} from '@angular/core';
import { NotificationsService as AngularNotifications } from 'angular2-notifications' ;

import { Student } from '../../student/student';
import { Exam } from '../../academics/exams/exam';
import { StudentScore } from './student-score';

import { ExamService } from '../../academics/exams/exam.service';
import { ClassesDataService } from '../../academics/classes/classes-data.service';
import { SchoolDataService } from '../../management/school/school-data.service';
import { StudentService } from '../../student/student.service';
import { StudentScoreService } from './student-score.service';

@Pipe({
    name: 'studentScoreFilter',
    pure: true
})

export class StudentScoreFilter implements PipeTransform {

    constructor()
    {}

    transform(students: StudentScoreDetails[],class_info_key: string, division: string): any {
      console.log('class_info_key: '+class_info_key+' division: '+division);
      if(class_info_key === 'All'  && division === 'All'){
        return [];
      }
      let student_list = students;

      if (class_info_key !== 'All') {
        student_list = student_list.filter(x => {
          return (x.current_class_key === class_info_key);
        })
      }
      if (division !== 'All') {
        student_list = student_list.filter(x => {
          return (x.division === division);
        })
      }
      return student_list;
    }
}

class StudentScoreDetails {
  student_score_key: string;
  exam_key: string;
  student_key: string;
  score: number;
  current_class_key: string;
  division: string;
  admission_number: string;
  full_name: string;
  subject_code: string;
}


class MarkList {
  student_key: string;
  current_class_key: string;
  division: string;
  admission_number: string;
  full_name: string;
  marks: Mark[] = [];
}

class Mark{
  student_score_key: string;
  exam_key: string;
  subject_code: string;
  score: number;
}

@Component({
  selector: 'app-student-score',
  templateUrl: './student-score.component.html',
  styleUrls: ['./student-score.component.css']
})
export class StudentScoreComponent implements OnInit {

  exams: Exam[] = [];
  exam_series_list: Exam[] = [];
  mark_list: MarkList[] = [];
  student_scores: StudentScore[] = [];
  selected_exam: Exam = new Exam();
  selected_series_code: string = 'All';
  selected_class_info_key: string = 'All';
  selected_division: string = 'All';
  selected_exam_key: string = 'All';
  academic_year: string;
  isEditing: boolean;
  invalid_score_message: string = '';
  constituent_subjects: string[];
  has_constituent_subjects: boolean;

  students_score_details: StudentScoreDetails[] = [];
  student_list: Student[] = [];

  public options = {
    position: ["bottom", "right"],
    timeOut: 5000,
    lastOnBottom: true
  };

  constructor(
              private schoolDataService: SchoolDataService,
              private studentService: StudentService,
              private studentScoreService: StudentScoreService,
              private examService: ExamService,
              private angularNotifications: AngularNotifications,
              private classesDataService: ClassesDataService
  ) { }

  ngOnInit() {
    this.isEditing = false;
    this.has_constituent_subjects = false;
    this.academic_year = this.schoolDataService.getCurrentAcademicYear().code;
    this.getStudentList();
    this.getExamList();
  }

  private getStudentList(){
    this.studentService.getStudentList(this.schoolDataService.getSchool().school_id).then(resp => {
      this.student_list = resp;
      this.initStudentScoreList();
      this.initMarkList();
    });
  }

  initMarkList(){
    this.mark_list = [];
    for(let student of this.student_list){
      let detail = new MarkList();
      detail.admission_number = student.admission_number;
      detail.full_name = student.full_name;
      detail.current_class_key = student.current_class_key;
      detail.division = student.division;
      detail.student_key = student.student_key;
      this.mark_list.push(detail);
    }
    this.sortMarkList();
  }

  initStudentScoreList(){
    this.students_score_details = [];
    for(let student of this.student_list){
      let detail = new StudentScoreDetails();
      detail.admission_number = student.admission_number;
      detail.full_name = student.full_name;
      detail.current_class_key = student.current_class_key;
      detail.division = student.division;
      detail.student_key = student.student_key;
      this.students_score_details.push(detail);
    }
    this.sortStudentList();
  }

  sortStudentList(){
    this.students_score_details.sort(function(a, b) {
        var nameA = a.full_name.toLowerCase(),
            nameB = b.full_name.toLowerCase()
        if (nameA < nameB)
          return -1
        if (nameA > nameB)
          return 1
       })
  }

  sortMarkList(){
    this.mark_list.sort(function(a, b) {
        var nameA = a.full_name.toLowerCase(),
            nameB = b.full_name.toLowerCase()
        if (nameA < nameB)
          return -1
        if (nameA > nameB)
          return 1
       })
  }

  getExamList(){
    let exam = new Exam();
    exam.institution_key = this.schoolDataService.getSchool().school_id;
    exam.academic_year = this.academic_year;

    this.examService.getExamList(exam).then(resp=>{
      this.exams = resp.filter(x => x.series_code !== undefined);
      this.exams.sort(function(a, b) {
          var nameA = a.name.toLowerCase(),
              nameB = a.name.toLowerCase()
          if (nameA < nameB)
            return -1
          if (nameA > nameB)
            return 1
         });
    })
  }

  getExamSeriesScore(){
    this.initMarkList();
    this.mark_list = this.mark_list.filter(x=>x.current_class_key === this.selected_class_info_key && x.division === this.selected_division);

    this.isEditing = false;
    this.has_constituent_subjects = false;
    let subject_list = this.exams.filter(x => x.series_code === this.selected_series_code && x.class_key === this.selected_class_info_key);
    for(let exam of subject_list){
    this.studentScoreService.getStudentScoreForExam(exam.exam_key).then(resp => {
      if(resp.length>0){
          for(let student_score of resp){
            for(let student_detail of this.mark_list){
              if(student_detail.student_key === student_score.student_key){
                // console.log(student_detail.full_name+'....'+student_score.score);
                let mark: Mark = new Mark();
                if(!student_detail.marks.find(x=>x.student_score_key === student_score.student_score_key)){
                  mark.score = student_score.score;
                  mark.student_score_key = student_score.student_score_key;
                  mark.exam_key = student_score.exam_key;
                  mark.subject_code = exam.subject_code;
                  student_detail.marks.push(mark);
                }
                else{
                  mark.exam_key = student_score.exam_key;
                  mark.subject_code = exam.subject_code;
                  student_detail.marks.push(mark);
                }
              }
            }
          }
        }
      });
    }
  }

  hasConstituentSubjects(code){
    let subjects = this.getClasses().find(x => x.class_info_key === this.selected_class_info_key).subjects;
    let subject = subjects.find(x => x.code === code);
    if(subject.constituent_subjects){
      return true;
    }
    else{
      return false;
    }
  }

  getStudentScore(){
    this.isEditing = false;
    this.has_constituent_subjects = false;
    this.student_scores = [];
    this.initStudentScoreList();
    this.selected_exam = this.exams.find(x=>x.exam_key === this.selected_exam_key);
    if(this.selected_exam){
      this.has_constituent_subjects = this.hasConstituentSubjects(this.selected_exam.subject_code);

        if(this.selected_exam_key){
          this.studentScoreService.getStudentScoreForExam(this.selected_exam_key).then(resp => {
            this.student_scores = resp;
            if(resp.length>0){
              for(let student_score of resp){
                let student_detail = this.students_score_details.find(x => x.student_key === student_score.student_key);
                student_detail.student_score_key = student_score.student_score_key;
                student_detail.exam_key = student_score.exam_key;
                student_detail.score = student_score.score;
                student_detail.subject_code = this.selected_exam.subject_code;
              }
            }
            else{
              this.initStudentScoreList();
            }
            this.sortStudentList();
          })
        }

      if(this.has_constituent_subjects){
        this.calculateFinalMark();
      }
    }
  }

  calculateFinalMark(){
    let selected_students = this.students_score_details.filter(x => x.current_class_key === this.selected_class_info_key);
    if(this.selected_division!=='All'){
      selected_students = selected_students.filter(x=>x.division === this.selected_division);
    }

    // this.constituent_subjects = this.selected_exam.aggregation_info.constituent_exams;
    let calculation_method;
    // calculation_method = this.selected_exam.aggregation_info.aggregation_method.aggregate_type
    for(let student of selected_students){
      student.subject_code = this.selected_exam.subject_code;
      student.exam_key = this.selected_exam.exam_key;
      this.studentScoreService.getStudentScoreForExam(student.exam_key).then(resp_score => {
        if(resp_score.length>0){
          if(resp_score.find(x => x.student_key === student.student_key)){
            student.student_score_key = resp_score.find(x=>x.student_key===student.student_key).student_score_key;
          }
        }
      });
      let all_scores : number[] = [];
      let score: number = 0;
      this.studentScoreService.getStudentScore(student.student_key).then(resp => {
        for(let con_sub of this.constituent_subjects){
          let current_exam = this.exams.find(x => x.series_code === this.selected_exam.series_code && x.subject_code === con_sub);
          let exam_result = resp.find( x => x.exam_key === current_exam.exam_key);
          if(!exam_result){
            console.warn('Marks not entered..............');
          }
          else{
            all_scores.push(exam_result.score);
          }
        }
        switch(calculation_method){
          case 'ADD':{
            let sum: number = 0;
            if(all_scores.length>0){
              for(let score of all_scores){
                sum = sum + score;
              }
            }
            student.score = sum;
            break;
          }
          case 'AVG':{
            let sum: number = 0;
            if(all_scores.length>0){
              for(let score of all_scores){
                sum = sum + score;
              }
              student.score = sum/all_scores.length;
            }
            break;
          }
          case 'BEST':{
            if(all_scores.length>0){
              all_scores.sort((n1,n2) => n1 - n2);
              student.score = all_scores[all_scores.length-1];
            }
            else{
              student.score = 0;
            }
            break;
          }
        }
      });
    }
  }

  onClassChange(){
    this.selected_division = 'All';
    this.selected_exam_key = 'All';
    this.selected_series_code = 'All';
    this.selected_exam = null;
    this.isEditing = false;
    this.has_constituent_subjects = false;
    this.getExamSeriesScoreForClass();
  }

  onDivisionChange(){
    this.isEditing = false;
    this.has_constituent_subjects = false;
    this.selected_series_code = 'All';
    this.getExamSeriesScoreForClass();
  }

  getSubjectName(code){
    let subject;
    if(code){
      subject = this.schoolDataService.getSchool().academic_configuration.subjects.find(x=>x.code===code).name;
    }
    return subject;
  }

  getExamsForClass(){
    let exams = this.exams.filter(x=>x.class_key===this.selected_class_info_key && x.status === 'MARK_ENTRY');
    exams.sort(function(a, b) {
        var nameA = a.name.toLowerCase(),
            nameB = b.name.toLowerCase()
        if (nameA < nameB)
          return -1
        if (nameA > nameB)
          return 1
       });
    return exams;
  }

  getExamSeriesScoreForClass(){
    let exams = this.exams.filter(x=>x.class_key===this.selected_class_info_key);
    this.exam_series_list = [];
    for(let detail of exams){
      if(!this.exam_series_list.find(x=> x.series_code === detail.series_code)){
        this.exam_series_list.push(detail);
      }
    }
    this.exam_series_list.sort(function(a, b) {
        var nameA = a.name.toLowerCase(),
            nameB = b.name.toLowerCase()
        if (nameA < nameB)
          return -1
        if (nameA > nameB)
          return 1
       });
  }

  getClasses(){
    return this.classesDataService.getClasses().filter(x => x.type === 'regular' && x.academic_year === this.academic_year)
      .sort(function(a,b){return (a.order_index) - (b.order_index)});
  }

  getDivisions(){
    if(this.selected_class_info_key){
      return this.classesDataService.getDivisionCodesList(this.academic_year, this.selected_class_info_key);
    }
  }

  isValidScore(){
    console.log("[StudentScoreComponent] isValidScore() ....")
    let is_invalid_score : boolean = false;
    let selected_students = this.students_score_details.filter(x => x.current_class_key === this.selected_class_info_key && x.division === this.selected_division);
    for(let student of selected_students){
      console.log("[StudentScoreComponent] S - " + student.score + " M - " + this.selected_exam.max_score);
      if(student.score > this.selected_exam.max_score){
        is_invalid_score = true;
      }
    }
    return is_invalid_score;
  }

  saveScore(){
    this.invalid_score_message = '';
    let school_id = this.schoolDataService.getSchool().school_id;
    let selected_students = this.students_score_details.filter(x => x.current_class_key === this.selected_class_info_key);
    if(this.selected_division!=='All'){
      selected_students = selected_students.filter(x=>x.division === this.selected_division);
    }
    let results = [];

      for(let student of selected_students){
        if(student.student_score_key && student.score){
          let score_details = this.student_scores.find(x=>x.student_score_key===student.student_score_key);
          if(score_details.score !== student.score){
            score_details.score = student.score;
            let result = this.studentScoreService.updateStudentScore(score_details).then(resp => {
              console.log('[StudentScoreDetails] saveScore() Score updated for '+score_details.student_key);
            }).catch(resp => {
              this.showErrorNotification('Error', 'Score details could not be updated');
            });
            results.push(result);
          }
        }
        else if(student.score){
          let score_details = new StudentScore();
          score_details.institution_key = school_id;
          score_details.max_score = this.selected_exam.max_score;
          score_details.exam_key = this.selected_exam.exam_key;
          score_details.score = student.score;
          score_details.student_key = student.student_key;
          let result = this.studentScoreService.addStudentScore(score_details).then(resp => {
            console.log('[StudentScoreDetails] saveScore() Score added for '+score_details.student_key);
          }).catch(resp => {
            this.showErrorNotification('Error', 'Score details could not be added');
          });
          results.push(result);
        }
      }
      Promise.all(results).then(resp => {
        this.showSuccessNotification('Success', 'Score details added');
        this.isEditing = false;
        this.has_constituent_subjects = false;
      });
  }

    private showSuccessNotification(title, msg){
      const toast = this.angularNotifications.success(title, msg, {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: false,
        clickIconToClose: true
      });
    }

    private showErrorNotification(title, msg){
      const toast = this.angularNotifications.error(title, msg, {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: false,
        clickIconToClose: true
      });
    }
}
