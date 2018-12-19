import { Component, OnChanges, ViewContainerRef, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { School, Class, Divisions, AcademicYear, ExamConfiguration, ExamSeries } from '../../../management/school/school';
import { SchoolDataService } from '../../../management/school/school-data.service';
import { ClassInfoService} from '../../classes/class-info.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ExamService } from '../exam.service';
import { Exam } from '../exam';

@Component({
	selector: 'exam-schedule',
	templateUrl: 'exam-schedule.component.html',
	styleUrls: ['exam-schedule.component.css'],
})
export class ExamScheduleComponent implements OnChanges {
	examSeries: ExamSeries;
	school: School;
	all_exams: Exam[];
	exams: any;
	classes: any;
	status_types = ["Pending", "Approved"];
	start_date: NgbDateStruct;
  end_date: NgbDateStruct;
  exam_date: any;
  time: any;
  exams_status: any;
  collapsed: boolean[];
  is_details_loaded = false;

  @Input('examCode') exam_key: string;
  @Input('academicYear') cur_aca_year: string; 
	constructor(private schoolDataService: SchoolDataService, 
				private route: ActivatedRoute,
				private classInfoService : ClassInfoService,
				private examService: ExamService,
				public toastr: ToastsManager,
        private vcr: ViewContainerRef,) {
					this.toastr.setRootViewContainerRef(vcr);
				}

	ngOnChanges() {
    this.format();
    if (typeof this.exam_key != 'undefined' && typeof this.cur_aca_year != 'undefined') {
      this.toastr.setRootViewContainerRef(this.vcr);
      this.is_details_loaded = false;
      this.school = this.schoolDataService.getSchool();
      console.log(this.exam_key, this.cur_aca_year);
      this.examSeries = this.school.academic_configuration.exam_configuration.exam_series.filter(exam => (exam.code == this.exam_key))[0];
      this.setDateRange();
      this.classInfoService.getClassInfoList(this.school.school_id).then(resp => {
        this.classes = resp.filter(x => (x.type === "regular" && x.academic_year == this.cur_aca_year));
        this.classes.sort(function(a,b) {
          return (a.order_index) - (b.order_index);
        });
        this.separateByClass();
      });
    }
  }

  private format() {
    this.time = [];
    this.exam_date = [];
    this.exams_status = [];
    this.exams = [];
    this.collapsed = [];
  }

	public getClassInfo(class_key){
		if(this.classes){
			return this.classes.find( x => x.class_info_key === class_key);
		}
	}

	ngAfterViewInit() {}

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

  setDateRange() {
  	let from_date = new Date(this.examSeries.from_date);
  	let to_date = new Date(this.examSeries.to_date);
    this.start_date = {year: from_date.getFullYear(), month: from_date.getMonth() + 1, day: from_date.getDate()};
    this.end_date = {year: to_date.getFullYear(), month: to_date.getMonth() + 1, day: to_date.getDate()};
  }

  getTime(time: string) {
  	let hour = Number(time.substring(0, 2));
  	let minute = Number(time.substring(3, 5));
  	if (time.substring(6) == "PM") hour += 12;
  	return {hour: hour, minute: minute};
  }

	separateByClass() {
		let i = 0;
    this.format();
    this.is_details_loaded = false;
		this.examService.getExamList({institution_key: this.school.school_id, academic_year: this.cur_aca_year}).then(res => {
			this.all_exams = res.filter(x => (x.academic_year == this.cur_aca_year && x.series_code == this.exam_key));
      console.log(this.all_exams);
			this.classes.forEach(cla => {
				let exam = this.all_exams.filter(exm => (exm.academic_year == this.cur_aca_year && exm.class_key == cla.class_info_key && exm.series_code == this.exam_key))
				console.log(exam);
        if (typeof exam != 'undefined' && exam && exam.length > 0) {
					this.collapsed.push(false);
					this.exams.push(exam);
					this.time.push([]);
					this.exam_date.push([]);
					this.exams_status.push([]);
					exam.forEach(ex => {
						if (typeof ex.from_time == 'undefined' || ex.from_time == null)
							this.time[i].push({from: {hour: null, minute: null}, to: {hour: null, minute: null}})
						else {
							this.time[i].push({from: this.getTime(ex.from_time), to: this.getTime(ex.to_time)})
						}
						if (typeof ex.date_time != 'undefined') {
							let tmp: Date = new Date(ex.date_time);
							this.exam_date[i].push({year: tmp.getFullYear(), month: tmp.getMonth() + 1, day: tmp.getDate()});
						}
						else {
							this.exam_date[i].push(null);
						}
						if (ex.status == 'NEW')
							this.exams_status[i].push('Pending');
						else
							this.exams_status[i].push('Approved');
					})
					i ++;
				}
        this.is_details_loaded = true;
			});
			this.setDropDown();
			console.log(this.exams, this.time);
      this.is_details_loaded = true;
		});
	}

  convertNgbDateToStr(date) {
    return date.year + "-" + this.formatNum(date.month) + "-" + this.formatNum(date.day);
  }

	saveChanges() {
		let changed = true;
		for (let i = 0; i < this.exams.length; i ++) {
			for (let j = 0; j < this.exams[i].length; j ++) {
				if (this.exam_date[i][j]){
					this.exams[i][j].date_time = this.convertNgbDateToStr(this.exam_date[i][j]);
				}
				let timeTxt = this.getTimeTxt(i, j);
				if (timeTxt != "Edit Time") {
					this.exams[i][j].from_time = timeTxt.substring(0, 8);
					this.exams[i][j].to_time = timeTxt.substring(12);
				}
				if (this.exams_status[i][j] == 'Approved' && this.exams[i][j].status != 'SCHEDULED'){
					this.exams[i][j].status = 'SCHEDULED';
					this.exams[i][j].audit_logs.push({date_time: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), message: "Exam Scheduled"});
				}
				console.log(this.exams[i][j]);
				this.examService.updateExam(this.exams[i][j]).then(resp => {}).catch(resp => {
          this.showNotification('error', "Exams in Class" +
            this.exams[i][j].class_key +
            " " + this.exams[i][j].division +
            " could not be added"
           );
          changed = false;
        });
			}
		}
		setTimeout(() => {
			if (changed == true){
				this.showNotification('success', "Exams have been Successfully updated");
			}
		}, 1500);
	}

	setDropDown() {
    $('.tp-dropdown > div').on('click', function (event) {
    	console.log(this.aaaa);
      $(this).parent().addClass('open');
    });

    $('body').on('click', function (e) {
      if (!$('.dropdown-menu.tp-dropdown').is(e.target)
        && $('.dropdown-menu.tp-dropdown').has(e.target).length === 0
        && $('.open').has(e.target).length === 0
      ) {
        $('.tp-dropdown').removeClass('open');
      }
    });
  }

  row_toggle(index) {
  	this.collapsed[index] = !this.collapsed[index];
  	this.setDropDown();
  }

  getColTxt(index) {
  	return !this.collapsed[index] ? "View Schedule" : "Close Schedule";
  }

  formatNum(num:Number) {
    if (num < 10) return "0" + num.toString();
    return num.toString();
  }

  getTimeText(time) {
  	let meridian = " AM"
  	let hour = time.hour, minute = time.minute;
  	if (hour == 0) hour = 12;
  	else if (hour >= 12) meridian = " PM";
  	if (hour >= 13) hour -= 12;
  	return this.formatNum(hour) + ":" + this.formatNum(minute) + meridian;
  }

  getTimeTxt(i, j) {
  	if (typeof this.time[i][j].from == 'undefined' || typeof this.time[i][j].to == 'undefined' ||
  		!this.time[i][j].from || !this.time[i][j].to)
  		return "Edit Time";
  	if (this.time[i][j].from.hour == null || this.time[i][j].from.minute == null || this.time[i][j].to.hour == null || this.time[i][j].to.minute == null)
  		return "Edit Time";
  	return this.getTimeText(this.time[i][j].from) + " to " + this.getTimeText(this.time[i][j].to);
  }

  onSelectStatus(status, i, j) {
  	this.exams_status[i][j] = status;
  }

  getSubName(sub_code) {
  	return this.school.academic_configuration.subjects.filter(subject => (subject.code == sub_code))[0].name;
  }

  changeScore(score, i, j) {
  	this.exams[i][j].max_score = score;
  }

  getStatus(i) {
  	let retval = 'Approved';
  	this.exams_status[i].forEach(status => {
  		if (status == 'Pending'){
  			retval = 'Pending';
  			return;
  		}
  	});
  	return retval;
  }
   
  cancelChanges() {
    this.separateByClass();
  }
}

