import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NotificationsService as AngularNotifications } from 'angular2-notifications' ;
// import { AggregationInfo, AggregationMethod } from '../exam';

import { Exam} from '../exam';
import { ClassInfo } from '../../classes/class-info';
import { AcademicYear, Divisions, AssessmentType, ExamType, ExamStatus } from '../../../management/school/school';

import { SchoolDataService } from '../../../management/school/school-data.service';
import { ClassesDataService } from '../../classes/classes-data.service';
import { StudentScoreService } from '../../student-score/student-score.service';
import { ClassInfoService} from '../../classes/class-info.service';
import { ExamService} from '../exam.service';

@Component({
  selector: 'app-exam-info',
  templateUrl: './exam-info.component.html',
  styleUrls: ['./exam-info.component.css']
})
export class ExamInfoComponent implements OnInit {

  exam: Exam = new Exam();
  existing_agg_type: string;
  classes: ClassInfo[] = [];
  selected_classes: string[] = [];
  divisions: Divisions[];
  assessment_types: AssessmentType[];
  exam_types: ExamType[];
  exam_status: ExamStatus[];
  selected_academic_year: string;
  has_constituent_subjects: boolean = false;
  isEditing: boolean;
  isExamSeries: boolean;
  no_edit: boolean;

  public options = {
    position: ["bottom", "right"],
    timeOut: 5000,
    lastOnBottom: true
  };

  constructor(private classesDataService: ClassesDataService,
              private schoolDataService: SchoolDataService,
              private examService: ExamService,
              private router: Router,
              private route: ActivatedRoute,
              private studentScoreService: StudentScoreService,
              private angularNotifications: AngularNotifications,
              private classInfoService : ClassInfoService)
  { }

  ngOnInit() {
    this.selected_academic_year = this.schoolDataService.getCurrentAcademicYear().code;
    this.assessment_types = this.schoolDataService.getSchool().academic_configuration.exam_configuration.assessment_types;
    this.exam_types = this.schoolDataService.getSchool().academic_configuration.exam_configuration.exam_types;
    this.exam_status = this.schoolDataService.getSchool().academic_configuration.exam_configuration.exam_status;
    let exam_key = this.route.snapshot.params['exam_key'];
    if(exam_key){
        this.examService.getExamDetails(exam_key).then(resp=>{
          this.exam = resp;
          // this.existing_agg_type = resp.aggregation_info.aggregation_method.aggregate_type;
          this.hasConstituentSubjects();
          this.selected_academic_year = this.exam.academic_year;
        })
      this.isEditing = false;
    }
    else{
      this.exam = new Exam();
      this.exam.academic_year = this.selected_academic_year;
      this.exam.institution_key = this.schoolDataService.getSchool().school_id;
      this.isEditing = true;
      this.isExamSeries = true;
    }
    this.loadClasses();
  }

  private loadClasses(){
    if(!this.classesDataService.getClasses()){
      this.classInfoService.getClassInfoList(this.exam.institution_key).then(resp => {
        this.classesDataService.setClasses(resp);
        this.classes = resp.filter(x => (x.type === 'regular' && x.academic_year === this.selected_academic_year));
        this.classes.sort(function(a,b){return (a.order_index) - (b.order_index);
        });
      });
    }
    else{
      this.classes = this.classesDataService.getClasses().filter( x => x.type === "regular" && x.academic_year === this.selected_academic_year)
                  .sort(function(a,b){return (a.order_index) - (b.order_index)});
    }
  }

  public isClassSelected(classInfoKey){
    if(this.selected_classes.find(x => x === classInfoKey)){
      return true;
    }
  }

  public addOrRemoveClass(class_key){
    let index = this.selected_classes.findIndex( x => x === class_key);
    if(index > -1){
      this.selected_classes.splice(index, 1);
    }else{
      this.selected_classes.push(class_key);
    }
  }

  private genExamCode() {
    let code = Math.random().toString(36).slice(2, 9);
    console.log('[ExamInfoComponent] exam_code', code);
    return code;
  }

  private genExamSeriesCode() {
    let code = Math.random().toString(36).slice(2, 9);
    console.log('[ExamInfoComponent] series_code', code);
    return code;
  }

  edit(){
    this.isEditing = true;
  }

  getClass(class_key){
    let class_name;
    if(class_key){
      class_name = this.classes.find(x=>x.class_info_key===class_key).name;
    }
    return class_name;
  }

  getAssessmentType(code){
    let assessment_type;
    if(code){
      assessment_type = this.assessment_types.find(x => x.code === code).name;
    }
    return assessment_type;
  }

  getExamType(code){
    let exam_type;
    if(code){
      exam_type = this.exam_types.find(x => x.code === code).name;
    }
    return exam_type;
  }

  getExamStatus(code){
    let exam_status;
    if(code){
      exam_status = this.exam_status.find(x => x.code === code).name;
    }
    return exam_status;
  }

  getSubjectName(code){
    let subject;
    if(code){
      subject = this.schoolDataService.getSchool().academic_configuration.subjects.find(x=>x.code===code).name;
    }
    return subject;
  }

  addOrUpdateExam(){
    if(this.exam.exam_key){
      this.updateExam();
    }
    else{
      this.addExam();
    }
  }

  hasConstituentSubjects(){
    let subjects = this.classesDataService.getClasses().find(x => x.class_info_key === this.exam.class_key).subjects;
    let subject = subjects.find(x => x.code === this.exam.subject_code);
    if(subject.constituent_subjects){
      this.has_constituent_subjects = true;
    }
    else{
      this.has_constituent_subjects = false;
    }
  }

  getAggregationType(class_key, code){
    let subjects = this.classesDataService.getClasses().find(x => x.class_info_key === class_key).subjects;
    let subject = subjects.find(x => x.code === code);
    let aggregation_info = null;
    if(subject.constituent_subjects){
      this.has_constituent_subjects = true;
      // aggregation_info = new AggregationInfo();
      // aggregation_info.aggregation_method = new AggregationMethod();
      // aggregation_info.aggregation_method.aggregate_type = "ADD";
      // aggregation_info.constituent_exams = subject.constituent_subjects;
    }
    return aggregation_info;
  }

  updateExam(){
    if(!this.exam.series_name){
      this.exam.series_name = this.exam.name;
    }
    if(!this.exam.status){
      this.exam.status = 'SCHEDULED';
    }
    if(!this.exam.schedulable){
      this.exam.schedulable = 'YES';
    }
    if(!this.exam.visibility){
      this.exam.visibility = 'SCHOOL';
    }
    this.examService.updateExam(this.exam).then( resp => {
        console.log('[ExamInfoComponent] updateExam() - Exam details updated');
        this.showSuccessNotification('Success', 'Exam details updated');
        // if(this.exam.aggregation_info.aggregation_method.aggregate_type !== this.existing_agg_type){
        //   this.clearScore(this.exam.exam_key);
        // }
      });
      this.isEditing = false;
  }

  clearScore(exam_key: string){
    this.studentScoreService.getStudentScoreForExam(exam_key).then(resp => {
      for(let score of resp){
        score.score = 0;
        this.studentScoreService.updateStudentScore(score).then(resp => {
          console.log('[ExamInfoComponent] clearScore() Score reset for '+score.student_key);
        }).catch(resp => {
          this.showErrorNotification('Error', 'Score details could not be updated');
        });
      }
    });
  }

  addExam(){
    // this.exam.code = this.genExamCode();
    this.exam.series_code = this.genExamSeriesCode();
    this.exam.status = 'SCHEDULED';
    this.exam.schedulable = 'YES';
    this.exam.visibility = 'SCHOOL';
    let results = [];

    for(let class_key of this.selected_classes){
      let class_info = this.classesDataService.getClasses().find(x=>x.class_info_key===class_key);

      for(let subject of class_info.subjects){
        let exam_clone = this.getExamClone(this.exam);
        exam_clone.class_key = class_key;
        exam_clone.subject_code = subject.code;
        if(this.getAggregationType(class_key,subject.code)){
          // exam_clone.aggregation_info = this.getAggregationType(class_key,subject.code);
        }
        let result = this.examService.addExam(exam_clone).then( resp => {
          console.log('[ExamInfoComponent] addExam() - Exam details added');
        }).catch(resp => {
          this.showErrorNotification('Error', 'Exam details could not be added');
        });
        results.push(result);
      }
    }

    Promise.all(results).then(resp => {
      this.showSuccessNotification('Success', 'Exam details added');
    })
    this.isExamSeries = false;
    this.no_edit = true;
    this.isEditing = false;
  }

  private getExamClone(exam){
    let examClone = JSON.parse(JSON.stringify(exam));
    return examClone;
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

  goToExamList(){
    this.router.navigate(['academics/exams']);
  }
}
