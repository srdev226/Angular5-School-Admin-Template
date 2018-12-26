import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SchoolDataService } from '../management/school/school-data.service';
import { School, Class, Divisions, AcademicYear, ExamConfiguration, ExamSeries } from '../management/school/school';
import { trigger, state, animate, transition, style } from '@angular/animations';
class Year {
	year: number;
	start_date: Date;
	end_date: Date;
}

@Component({
  selector: 'calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css'],
	animations: [
		trigger('fade', [
			state('void', style({opacity: 0})),

			transition('void => *', [
				animate(300)
			]),
		])
	]
})
export class CalenderComponent implements OnInit {
	school: School;
	academic_years: AcademicYear[];
	year_id: number;
	pre_year_id: number;
	cur_month: number;
	pre_month: number;
	year_range: Year[];
	is_details_loaded: boolean;
	arrow_clicked: boolean;
	months: string[] = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
	];
  constructor(private router: Router,
  						private schoolDataService: SchoolDataService,) { }

  ngOnInit() {
    this.router.navigate(['/calender']);
    this.school = this.schoolDataService.getSchool();
    this.academic_years = this.school.academic_years;
    this.format();
  }

  format() {
  	this.arrow_clicked = true;
  	this.is_details_loaded = false;
  	this.year_range = [];
  	this.year_range.push({year: null, start_date: null, end_date: null})
  	for (let i = 0; i < this.academic_years.length; i ++) {
  		let start_date: Date = new Date(+this.academic_years[i].start_date.substring(6), (+this.academic_years[i].start_date.substring(3, 5)) - 1, (+this.academic_years[i].start_date.substring(0, 2)));
  		let end_date: Date = new Date(+this.academic_years[i].end_date.substring(6), (+this.academic_years[i].end_date.substring(3, 5)) - 1, (+this.academic_years[i].end_date.substring(0, 2)));
  		this.year_range.push({year: null, start_date: null, end_date: null})
  		this.year_range[i + 1].year = end_date.getFullYear();
  		console.log(this.academic_years[i], start_date, end_date);
  		if (i == 0){
  			this.year_range[i].year = start_date.getFullYear();
  		 	this.year_range[i].start_date = start_date;
  		 	this.year_range[i].end_date = new Date("31/12" + this.year_range[i].year);
  		}
  		if (i == this.academic_years.length - 1) {
  			this.year_range[i + 1].end_date = end_date;
  		}
  		else {
	  		this.year_range[i + 1].end_date = new Date("31/12" + this.year_range[i + 1].year);
	  	}
	  	this.year_range[i + 1].start_date = new Date("1/1/" + this.year_range[i + 1].year);
  	}
  	let cur_date = new Date();
  	let cur_year = this.year_range.find(year => (year.year == cur_date.getFullYear()));
  	if (typeof cur_year == 'undefined') {
  		this.year_id = this.year_range.length - 1;
  		this.cur_month = this.year_range[this.year_id].end_date.getMonth() + 1;
  	}
  	else {
  		this.year_id = this.year_range.indexOf(cur_year);
  		this.cur_month = cur_date.getMonth() + 1;
  	}
  	this.pre_month = this.cur_month - 1;
		this.pre_year_id = this.year_id;
		if (this.pre_month == 0){
			this.pre_year_id --;
			this.pre_month = 12;
  	}
  	console.log("[Year Range]", this.year_range);
  	setTimeout(() => {this.is_details_loaded = true}, 200);
  }

	daysInMonth (month, year) {
	  let days: any = [];
	  let len = new Date(year, month, 0).getDate();
	  for (let i = 0; i < len ; i ++)
	  	days.push(1);
	  return days;
	}

	fadeInAni() {
		this.arrow_clicked = false;
  	setTimeout(() => {this.arrow_clicked = true}, 100);
	}

  previousYear() {
  	if (this.year_id == 0) return false;
  	this.fadeInAni();
  	this.year_id --;
  	this.pre_year_id --;
  	if (this.year_id == 0 && this.year_range[this.year_id].start_date.getMonth() + 1 > this.pre_month ) {
  		this.pre_month = this.year_range[this.year_id].start_date.getMonth() + 1;
  		this.pre_year_id = this.year_id;
  		this.cur_month = this.pre_month + 1;
  	}
  	return true;
  }

  nextYear() {
  	if (this.year_id == this.year_range.length - 1) return false;
  	this.fadeInAni();
  	this.year_id ++;
  	this.pre_year_id ++;
  	if (this.year_id == this.year_range.length - 1 && this.year_range[this.year_id].end_date.getMonth() + 1 < this.cur_month) {
  		this.cur_month = this.year_range[this.year_id].end_date.getMonth() + 1;
  		this.pre_month = this.cur_month - 1;
  		this.pre_year_id = this.year_id;
  	}
  	return true;
  }

  previousMonth() {
  	if (this.year_id == 0 && this.year_range[this.year_id].start_date.getMonth() + 2 == this.cur_month) return;
   	this.cur_month --;
  	this.pre_month --;
  	if (this.cur_month == 0) {
  		this.cur_month = 12;
  		this.year_id --;
  		this.fadeInAni();
  		return;
  	}
  	else if (this.cur_month == 1) {
  		this.pre_month = 12;
  		this.pre_year_id --;
  	}
  }

  nextMonth() {
  	if (this.year_id == this.year_range.length - 1 && this.year_range[this.year_id].end_date.getMonth() + 1 == this.cur_month) return;
  	this.cur_month ++;
  	this.pre_month ++;
  	if (this.cur_month == 13) {
  		this.cur_month = 1;
  		this.year_id ++;
  		this.fadeInAni();
  		return;
  	} 
  	else if (this.cur_month == 2) {
  		this.pre_month = 1;
  		this.pre_year_id ++;
  	}
  }
}
