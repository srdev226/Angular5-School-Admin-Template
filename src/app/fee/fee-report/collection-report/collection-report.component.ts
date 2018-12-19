import { Component, OnInit, EventEmitter, Output, Input  } from '@angular/core';
import { SchoolDataService } from '../../../management/school/school-data.service';
import { School } from '../../../management/school/school';
import { FeeReport, StudentMonthlyStatus, MonthlyStatusList } from '../fee-report';
import { FeeRule } from '../../../management/fee-rule/fee-rule';
import { FeeReportFilter } from '../fee-report-filter';
import { FeeRuleService } from '../../../management/fee-rule/fee-rule.service';
import * as moment from 'moment';

class FeeTypeSummary{
  fee_type_key: string;
  fee_type_name: string;
  paid: number;
  overdue: number;
  due: number;
  new: number;
  total_unpaid: number;
}

@Component({
  selector: 'app-collection-report',
  templateUrl: './collection-report.component.html',
  styleUrls: ['./collection-report.component.css']
})
export class CollectionReportComponent implements OnInit {

  todays_date: String;
  school:School;
  currencyCode: string;
  fee_type_summary: FeeTypeSummary[];

  @Input()
  fee_register_report: FeeReport[];

  @Input()
  filterFeeRules: FeeRule[]

  constructor(private schoolDataService: SchoolDataService,
    private feeRuleService: FeeRuleService){
   }

  ngOnInit() {
    let student =[]
    this.currencyCode = this.schoolDataService.getCurrencyCode();
    this.todays_date = moment().format('Do MMM YYYY');
    this.school = this.schoolDataService.getSchool();
  }


  getFeeTypeArray(){
    this.getFeeTypeStatus();
    return this.fee_type_summary
  }

  public getFeeTypeStatus(){
    let total =0;
    this.fee_type_summary =[];
    this.initializeFeeType();
    for(let fee_type of this.fee_type_summary){
      let register_type = this.fee_register_report.filter(x=>x.monthly_payment_status_report.fee_rule_key === fee_type.fee_type_key);
      if(register_type){
      for(let paid_register of register_type){
        for(let monthly_status_list of paid_register.monthly_payment_status_report.student_monthly_status_list){
          for(let monthly_status of monthly_status_list.monthly_status_list){
            if(monthly_status.status !== 'PAID' && monthly_status.amount !== null){
             fee_type.total_unpaid = fee_type.total_unpaid + monthly_status.amount;
           }
            if(monthly_status.status === 'PAID' && monthly_status.amount !== null){
             fee_type.paid = fee_type.paid + monthly_status.amount;
          }
            if(monthly_status.status === 'OVERDUE' && monthly_status.amount !== null){
             fee_type.overdue = fee_type.overdue + monthly_status.amount;
          }
            if(monthly_status.status === 'DUE' && monthly_status.amount !== null){
             fee_type.due = fee_type.due + monthly_status.amount;

           }
            if(monthly_status.status === 'NEW' && monthly_status.amount !== null){
             fee_type.new = fee_type.new + monthly_status.amount;

           }
          }
        }
      }
    }
  }
 }

  public getPaidBills(){
    let total = 0;
    for(let paid_register of this.fee_register_report){
      for(let monthly_status_list of paid_register.monthly_payment_status_report.student_monthly_status_list){
        for(let monthly_status of monthly_status_list.monthly_status_list){
          if(monthly_status.status === 'PAID' && monthly_status.amount !== null){
          total = total + monthly_status.amount;
          }
        }
        }
      }
    return total
  }
  getOverdueBills(){
    let total = 0;
    for(let paid_register of this.fee_register_report){
      for(let monthly_status_list of paid_register.monthly_payment_status_report.student_monthly_status_list){
        for(let monthly_status of monthly_status_list.monthly_status_list){
          if(monthly_status.status === 'OVERDUE' && monthly_status.amount !== null){
          total = total + monthly_status.amount;
          }
        }
        }
      }
    return total
  }
  getDueBills(){
    let total = 0;
    for(let paid_register of this.fee_register_report){
      for(let monthly_status_list of paid_register.monthly_payment_status_report.student_monthly_status_list){
        for(let monthly_status of monthly_status_list.monthly_status_list){
          if(monthly_status.status === 'DUE' && monthly_status.amount !== null){
          total = total + monthly_status.amount;
          }
        }
        }
      }
    return total
  }
  getNewBills(){
    let total = 0;
    for(let paid_register of this.fee_register_report){
      for(let monthly_status_list of paid_register.monthly_payment_status_report.student_monthly_status_list){
        for(let monthly_status of monthly_status_list.monthly_status_list){
          if(monthly_status.status === 'NEW' && monthly_status.amount !== null){
          total = total + monthly_status.amount;
          }
        }
        }
      }
    return total
  }
  getTotalPendingBills(){
    let total = 0;
    for(let paid_register of this.fee_register_report){
      for(let monthly_status_list of paid_register.monthly_payment_status_report.student_monthly_status_list){
        for(let monthly_status of monthly_status_list.monthly_status_list){
          if(monthly_status.status !== 'PAID' && monthly_status.amount !== null){
          total = total + monthly_status.amount;
          }
        }
        }
      }
    return total
  }

  initializeFeeType(){
    this.fee_type_summary  = [];
    let fee_type: FeeTypeSummary;
    for(let feerule of this.filterFeeRules){
      fee_type = new FeeTypeSummary();
      fee_type.fee_type_name = feerule.name;
      fee_type.fee_type_key = feerule.fee_rule_key
      fee_type.paid = 0;
      fee_type.overdue = 0;
      fee_type.due = 0;
      fee_type.new = 0;
      fee_type.total_unpaid = 0;
      this.fee_type_summary.push(fee_type);
    }
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('register_print').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
      <head>
      <title>Print tab</title>
      <style>
      table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
        font-size: 70%;
      }
      td, th{
        border: 1px solid #424242;
        text-align: left;
      }
      .value{
        border-top: 2px solid black;
      }
      .padding{
        padding: 5px;
      }
      </style>
      </head>
      <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

}
