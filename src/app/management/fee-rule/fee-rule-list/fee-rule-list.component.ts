import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeeRuleService } from '../fee-rule.service';
import { FeeRule } from '../fee-rule';
import { SchoolDataService } from '../../../management/school/school-data.service';
import { School,Class,Divisions,AcademicYear } from '../../../management/school/school';

@Component({
  selector: 'app-fee-rule-list',
  templateUrl: './fee-rule-list.component.html',
  styleUrls: ['./fee-rule-list.component.css']
})

export class FeeRuleListComponent implements OnInit {

  constructor(private router: Router,
              private schoolDataService: SchoolDataService,
              private feeruleService: FeeRuleService) { }

  feeRules: FeeRule[];
  filteredFeeRules: FeeRule[];
  student_type: string;
  selected_year: string;
  academic_years: AcademicYear[];
  student_types = [{"name":"All","code":"ALL"},{"name":"New","code":"NEW"},{"name":"Existing","code":"EXISTING"}];

  ngOnInit() {
    this.feeruleService.getFeeRulesList(this.schoolDataService.getSchool().school_id).then(resp => {
      this.feeRules = resp;
      this.filteredFeeRules = this.feeRules
      this.academic_years = this.schoolDataService.getSchool().academic_years;
    });
    this.student_type = 'ALL'
  }
  public setYearType(){
  if(this.selected_year ==='undefined'){
    this.filteredFeeRules = this.feeRules
    }else{
    this.filteredFeeRules = this.feeRules.filter(x => x.academic_year === this.selected_year);
    }
  }

  public setStudentType(){
    if (this.student_type == "ALL"){
      this.filteredFeeRules= this.feeRules;
    }else{
      this.filteredFeeRules = this.feeRules.filter(x => x.student_type === this.student_type);
    }
  }


  gotoAddFeeRule() {
    this.router.navigate(['/manage/fee-rule/create']);
  }


}
