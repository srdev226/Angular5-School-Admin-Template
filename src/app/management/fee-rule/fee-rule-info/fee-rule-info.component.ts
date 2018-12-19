import { Component, OnInit } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeeRule, FeeInfo, ClassRule, AuditLog, FeePeriod, FeeAmount, TransportConfiguration, FeeItem } from '../fee-rule';
import { FeeRuleService } from '../fee-rule.service';
import { SchoolDataService } from '../../../management/school/school-data.service';
import { School,Class,Divisions,AcademicYear } from '../../../management/school/school';
import { SchoolService } from '../../../management/school/school.service';
import { Institution } from '../../../management/institution/institution';
import { InstitutionService } from '../../../management/institution/institution.service';
import { SchoolManagementService } from '../../../management/school-management/school-management.service';
import { ClassInfo } from '../../../academics/classes/class-info';
import { ClassInfoService } from '../../../academics/classes/class-info.service';
import { ClassesDataService } from '../../../academics/classes/classes-data.service';

import * as moment from 'moment';

enum PageStateType {BASIC,CLASS_RULE,FINE_RULE,CONFIRMATION}

export class PageState{
  constructor(public type: PageStateType){}
}

@Component({
  selector: 'app-fee-rule-info',
  templateUrl: './fee-rule-info.component.html',
  styleUrls: ['./fee-rule-info.component.css']
})
export class FeeRuleInfoComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router,
    private feeRuleService: FeeRuleService,
    private schoolDataService: SchoolDataService,
    private schoolManagementService: SchoolManagementService,
    private institutionService: InstitutionService,
    private classInfoService: ClassInfoService,
    private classesDataService: ClassesDataService)
  { }

  pageStateType = PageStateType;
  pageState: PageState;
  classes: any;
  feeTypes: any[];
  showConfirmation: boolean;
  isSuccess: boolean;
  isUpdate: boolean;
  feeRule: FeeRule;
  ui_class_rule: any;
  institutions: Institution[];
  cocurricular_classes: ClassInfo[];
  academic_years: AcademicYear[];
  academic_year: string;
  selected_year: AcademicYear;
  DAYS_OF_MONTH = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
  fee_rule_types = [{"name":"Standard", "code":"STANDARD"},{"name":"Cocurricular Class", "code":"CO_CURR"},
                    {"name":"Transport", "code":"TRANSPORT"}];
  student_types = [{"name":"All","code":"ALL"},{"name":"New","code":"NEW"},{"name":"Existing","code":"EXISTING"}];

  ngOnInit() {
    this.academic_years = this.schoolDataService.getSchool().academic_years;
    let management_key = this.schoolDataService.getSchool().school_information.school_management_key;
    if(this.schoolDataService.getSchool().cocurricular_classes){
      this.setCocurricularClasses();
    }
    this.institutionService.getInstituitionList(management_key)
    .then(resp => {
      this.institutions = resp;
    });
    this.showConfirmation = false;
    this.schoolManagementService.getManagement(management_key).then(resp => {
      this.feeTypes = resp.fee_configuration.fee_types;
    })
    let fee_rule_key = this.route.snapshot.params['fee_rule_key'];
    if (fee_rule_key) {
      this.setFeeRule(fee_rule_key);
      this.isUpdate = true;
    } else {
      this.initNewFeeRule();
    }
    this.ui_class_rule = {class_name: '', class_key: '', fee_type_code: '-1', amount: ''};
    this.pageState = new PageState(PageStateType.BASIC);
  }

  public initRuleType(){
    if(this.feeRule.fee_rule_type === 'TRANSPORT'){
      this.feeRule.transport_configuration = new TransportConfiguration();
      this.feeRule.transport_configuration.fee_item = new FeeItem();
    }else{
      this.feeRule.transport_configuration = undefined;
    }
  }

  private setCocurricularClasses(){
      this.cocurricular_classes = [];
      for(let cocurr_class of this.schoolDataService.getSchool().cocurricular_classes){
        this.classInfoService.getClassInfo(cocurr_class.class_info_key).then(resp => {
          this.cocurricular_classes.push(resp);
        }).catch(resp => {
          console.log("Error loading cocurricular class"); // TODO Error notification
        });
      }
  }

  private setClasses(){
    if(this.feeRule.fee_rule_type === 'STANDARD'){
      this.classes = this.getRegularClasses();
    }else if (this.feeRule.fee_rule_type === 'CO_CURR'){
      let cocurr_class = this.cocurricular_classes.find(cls => cls.class_info_key === this.feeRule.cocurricular_class_key);
      this.classes = [];
      for(let cls of cocurr_class.eligible_classes){
          let cl: any = {selected: false};
          cl.name = cls;
          this.classes.push(cl);
      }
    }
  }

  private getRegularClasses(){
    return this.classesDataService.getClasses().filter(x => (x.academic_year === this.feeRule.academic_year) && (x.type ==='regular'))
     .sort(function(a,b){return (a.order_index) - (b.order_index)});
  }
  private setPageState(state: PageStateType){
    this.pageState.type = state;
  }

  public selectedYear()
  {
    this.selected_year = this.academic_years.find(x => (x.code === this.feeRule.academic_year));
    this.feeRule.effective_from_date = this.selected_year.start_date;
    this.feeRule.effective_until_date = this.selected_year.end_date;
  }

  public processNext(){
    switch(this.pageState.type){
      case this.pageStateType.BASIC: {
        if(this.feeRule.fee_rule_type === 'STANDARD' || this.feeRule.fee_rule_type === 'CO_CURR'){
          this.setClasses();
          this.setPageState(this.pageStateType.CLASS_RULE);
          this.feeRule.fee_periods = this.getFeePeriods();
        }else if(this.feeRule.fee_rule_type === 'TRANSPORT'){
          this.setPageState(this.pageStateType.CLASS_RULE);
        }
        break;
      }
      case this.pageStateType.CLASS_RULE: {
        this.setPageState(this.pageStateType.FINE_RULE);
        break;
      }
      case this.pageStateType.FINE_RULE: {
        this.setPageState(this.pageStateType.CONFIRMATION);
        break;
      }
    }
  }

  public processBack(){
    switch(this.pageState.type){
      case this.pageStateType.CLASS_RULE: {
        this.setPageState(this.pageStateType.BASIC);
        break;
      }
      case this.pageStateType.FINE_RULE: {
        this.setPageState(this.pageStateType.CLASS_RULE);
        break;
      }
      case this.pageStateType.CONFIRMATION: {
        this.setPageState(this.pageStateType.FINE_RULE);
        break;
      }
    }
  }

  public getInstNameByKey(key){
    return this.institutions.filter(item => item.institution_key == key)[0].name;
  }


  private setFeeRule(fee_rule_key) {
    this.feeRuleService.getFeeRule(fee_rule_key).then(resp => {
      this.feeRule = resp;
      this.setClasses();
      this.initRuleType();
      if (this.feeRule.class_rules) {
        this.setSelectedClasses();
      }
      if (!this.feeRule.fine_rules){
        this.initFineRules();
      }
      if(!this.feeRule.class_rules){
        this.feeRule.class_rules = [];
      }
    })
  }

  private setSelectedClasses() {
    for(let class_rule of this.feeRule.class_rules){
      for(let class_data of this.classes){
        if(class_data.name == class_rule.applied_class) {
            class_data.selected = true;
            break;
        }
      }
    }
  }

  private initNewFeeRule() {
    this.feeRule = new FeeRule();
    this.feeRule.school_key = this.schoolDataService.getSchool().school_id + "";
    this.feeRule.currency = "INR";
    this.feeRule.status = "ACTIVE";
    this.initFineRules();
  }

  private initFineRules(){
    for(let i=1 ; i<4 ; i++){
      this.feeRule.fine_rules.push({index: i+'', days: 0, amount: 0});
    }
  }

  public pushFineRuleObj(index) {
    this.feeRule.fine_rules.push({index: (index+2)+'', days: 0, amount: 0});
  }

  public addOrUpdateFeeRule() {
    this.clearFineRuleData();
    if(this.feeRule.fee_rule_type === 'TRANSPORT'){
      this.feeRule.payment_frequency = 'MONTHLY';
      this.feeRule.transport_configuration.fee_item.name = this.feeTypes.find(x => x.code === this.feeRule.transport_configuration.fee_item.code).name;
    }
    if (this.feeRule.fee_rule_key) {
      this.feeRule.audit_logs.push(this.getAuditLog('Rule updated'));
      this.feeRuleService.updateFeeRule(this.feeRule).then(addFeeruleResponse => {
        this.isSuccess = true;
        this.gotoList();
      });
    } else {
      this.feeRule.audit_logs.push(this.getAuditLog('Rule added'));
      this.feeRuleService.addFeeRule(this.feeRule).then(addFeeruleResponse => {
        this.isSuccess = true;
        this.gotoList();
      });
    }
  }

  private getAuditLog(msg: string){
    let auditLog = new AuditLog();
    auditLog.date = new Date().toDateString();
    auditLog.message = msg;
    return auditLog;
  }

  private gotoList(){
    this.router.navigate(['manage/fee-rule/list']);
  }

  private clearFineRuleData(){
    for(let fine_rule of this.feeRule.fine_rules){
      if(!fine_rule.days || !fine_rule.amount){
        let arr_index = this.feeRule.fine_rules.indexOf(fine_rule);
        this.feeRule.fine_rules.splice(arr_index,1);
        this.clearFineRuleData();// Recursive call to deal with the issue when consecutive elements need to be removed
      }
    }
  }

  public addOrRemoveClass(activeClass) {
    activeClass.selected = !activeClass.selected;
    if(activeClass.selected){
      this.ui_class_rule.class_name = activeClass.name;
      this.ui_class_rule.class_key = activeClass.class_info_key;
    }else{
      this.removeClassRule(activeClass.class_info_key);
      this.ui_class_rule.class_name = '';
      this.ui_class_rule.class_key = '';
    }
  }

  private getSelectedFeeType(code){
    for(let fee_type of this.feeTypes){
      if(fee_type.code == code){
        return fee_type;
      }
    }
  }

  public addClassRule(){
    console.log('[FeeRuleInfoComponent] addClassRule()');
    let fee_info = this.getFeeInfo();
    let class_rule = this.getClassRule(this.ui_class_rule.class_key);
    if(!class_rule){
      class_rule = new ClassRule();
      class_rule.applied_class = this.ui_class_rule.class_name;
      class_rule.applied_class_key = this.ui_class_rule.class_key;
      if(!this.feeRule.class_rules){
        this.feeRule.class_rules = [];
      }
      this.feeRule.class_rules.push(class_rule);
    }
    class_rule.fee_list.push(fee_info);

    this.ui_class_rule = { class_name: class_rule.applied_class , class_key: class_rule.applied_class_key,
                           fee_type_code: '-1', amount: '' };
  }

  private getFeeInfo(): FeeInfo{
    let fee_info = new FeeInfo();
    fee_info.name = this.getSelectedFeeType(this.ui_class_rule.fee_type_code).name;
    fee_info.code = this.ui_class_rule.fee_type_code;
    fee_info.fee_amounts = this.getFeeAmounts();

    return fee_info;
  }


  private getFeePeriods(): FeePeriod[]{
    let feePeriods: FeePeriod[] = [];
    let from_date = moment(this.feeRule.effective_from_date, 'DD/MM/YYYY', true);
    let to_date = moment(this.feeRule.effective_until_date, 'DD/MM/YYYY', true);
    let period_from_date = from_date;

    while( period_from_date <  to_date){
      let fee_period = new FeePeriod();
      fee_period.start_date = period_from_date.format('DD/MM/YYYY');
      switch(this.feeRule.payment_frequency){
        case 'MONTHLY':{
          fee_period.end_date = period_from_date.add(1,'month').add(-1,'day').format('DD/MM/YYYY');
          period_from_date.add(1,'day');
          break;
        }
        case 'QUARTERLY':{
          fee_period.end_date = period_from_date.add(3,'month').add(-1,'day').format('DD/MM/YYYY');
          period_from_date.add(1,'day');
          break;
        }
        case 'ANNUAL':{
          fee_period.end_date = to_date.format('DD/MM/YYYY');
          period_from_date = to_date;
          break;
        }
        case 'ONETIME':{
          fee_period.end_date = to_date.format('DD/MM/YYYY');
          period_from_date = to_date;
          break;
        }
        default:{
          period_from_date = to_date;
          break;
        }
      }
      fee_period.code = fee_period.start_date + '-' + fee_period.end_date;
      feePeriods.push(fee_period);
    }
    return feePeriods;
  }

  private getFeeAmounts(): FeeAmount[]{
    let feeAmounts: FeeAmount[] = [];
    for(let fee_period of this.feeRule.fee_periods){
      let fee_amount = new FeeAmount();
      fee_amount.period_code = fee_period.code;
      fee_amount.amount = +this.ui_class_rule.amount;
      feeAmounts.push(fee_amount);
    }
    return feeAmounts;
  }

  private getClassRule(class_key){
    return this.feeRule.class_rules.find( x => (x.applied_class_key === class_key));
  }

  private removeClassRule(class_key){
    let class_rule = this.getClassRule(class_key);
    if(class_rule){
      let index: number = this.feeRule.class_rules.indexOf(class_rule);
      if(index !== -1){
          this.feeRule.class_rules.splice(index, 1);
      }
    }
  }


}

@Pipe({ name: 'totalFee', pure: false })
export class TotalFeePipe implements PipeTransform {
  transform(feeList: FeeInfo[]) {
    let total = 0;
    if(feeList){
      for(let fee of feeList){
          total = total + fee.fee_amounts[0].amount;
      }
    }
    return total;
  }
}
