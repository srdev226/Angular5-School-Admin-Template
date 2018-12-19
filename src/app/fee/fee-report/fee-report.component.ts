import { Component, OnInit, NgZone } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FeeBillService } from '../fee-bill/fee-bill.service';
import { FeeBill } from '../fee-bill/fee-bill';
import { BillCollection } from '../fee-bill/bill-collection';
import { SchoolDataService } from '../../management/school/school-data.service';
import { FeeReceiptService } from '../fee-bill/fee-receipt/fee-receipt.service';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { FeeRule } from '../../management/fee-rule/fee-rule';
import { FeeReceipt } from '../fee-bill/fee-receipt/fee-receipt';
import { FeeRuleService } from '../../management/fee-rule/fee-rule.service';
import { InstitutionService } from '../../management/institution/institution.service';
import { Institution } from '../../management/institution/institution';
import { FeeReportFilter } from './fee-report-filter';
import { FeeReportPipe } from '../../fee/fee-report/fee-report.pipe';
import { DailyCollectionPipe} from './daily-collection.pipe';
import { School } from '../../management/school/school';
import { ClassInfo } from '../../academics/classes/class-info';
import { FeeReport, StudentBill, DailyCollectionReport, DailyCollectionItem } from './fee-report';
import { FeeReportService } from './fee-report.service';
import { StudentService } from '../../student/student.service';
import { StudentDataService } from '../../student/student-data.service';
import { ClassesDataService } from '../../academics/classes/classes-data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-fee-report',
  templateUrl: './fee-report.component.html',
  styleUrls: ['./fee-report.component.css']
})
export class FeeReportComponent implements OnInit {
  private d3: D3;
  feeReports: FeeReport[];
  receipts: any[];
  cancelled_receipts: any[];
  total_receipts_net_amount = 0;
  total_receipts_discount_amount = 0;
  total_cancelled_receipts_net_amount = 0;
  total_cancelled_receipts_discount_amount = 0;

  daysList: any[];
  to_daysList: any[];
  school:School;
  classes: ClassInfo[] = [];
  selected_class: ClassInfo = new ClassInfo();
  selected_class_info_key: string;
  selected_division: string;
  showReportFlag: boolean = false;
  fee_report_filter: FeeReportFilter;
  all_daily_collection_report: FeeReport[] = [];
  due_bills_report: FeeReport[] = [];
  all_due_bills_report: FeeReport[] = [];
  fee_register_report: FeeReport[] = [];
  fee_registers: FeeReport[] = [];
  filterFeeRules: FeeRule[] =[];
  fee_type: FeeBill[] = [];
  daily_collection_report = null;
  multi: any;
  todays_date: String;
  currencyCode: string;
  month_count: any;
  bill_months: any[];
  is_loader: boolean;
  is_paid: boolean = false;
  nodata: boolean;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Rupees';

  colorScheme = {
    domain: ['#EF476F', '#3ED783', '#C7B42C', '#AAAAAA']
  };

  constructor(d3Service: D3Service, private schoolDataService: SchoolDataService,
    private feeBillService: FeeBillService,
    private feeruleService: FeeRuleService,
    private institutionService: InstitutionService,
    private feeReceiptService: FeeReceiptService,
    private feeReportService: FeeReportService,
    private studentService: StudentService,
    private studentDataService: StudentDataService,
    private classesDataService: ClassesDataService,
    private _ngZone: NgZone) {
    this.d3 = d3Service.getD3();
  }

  ngOnInit() {
    this.todays_date = moment().format('Do MMM YYYY');
    this.currencyCode = this.schoolDataService.getCurrencyCode();
    this.nodata = false;
    this.is_loader = false;
    this.fee_report_filter = new FeeReportFilter();
    this.school = this.schoolDataService.getSchool();
    let school_key = this.schoolDataService.getSchool().school_id;
    this.multi = [];
    let report_param = new FeeReport();
    report_param.school_key = this.schoolDataService.getSchool().school_id;
    report_param.report_type = 'DAILY_COLLECTION';
    this.feeReportService.getFeeReportByType(report_param).then(resp=>{
      this.all_daily_collection_report = resp;
    });
  }

  public getStudent(student_key){
    return this.studentDataService.getStudents().find(x => x.student_key === student_key);
  }

  public initReport(){
    if(this.fee_report_filter.fee_report_type === 'DAILY_COLLECTION' || this.fee_report_filter.fee_report_type === 'DAILY_RECEIPTS'){
      this.setDaysListFromDailyCollection();
      if(this.fee_report_filter.from_date || this.fee_report_filter.to_date){
        this.onDayChange();
      }
    }
    if(this.fee_report_filter.fee_report_type === 'DUE_BILLS'){
      this.setClasses();
      this.getDueBillsReport();
    }
    if(this.fee_report_filter.fee_report_type === 'MONTHLY_PAYMENT_STATUS'){
      this.setFeerule();
      this.setClasses();
      this.getFeeRegisterReport();
    }
    if(this.fee_report_filter.fee_report_type === 'COLLECTION SUMMARY'){
      this.setFeerule();
      this.getFeeRegisterReport();
    }
  }

  getFeeRuleName(){
    for(let fee_rule of this.filterFeeRules){
      if(fee_rule.fee_rule_key === this.fee_report_filter.fee_rule_key){
        return fee_rule.name
      }
    }
  }

  getDueBillsReport(){
    let report_param = new FeeReport();
    report_param.school_key = this.schoolDataService.getSchool().school_id;
    report_param.report_type = 'DUE_BILLS';
    this.feeReportService.getFeeReportByType(report_param).then(resp=>{
      this.all_due_bills_report = resp;
    });
  }

  getFeeRegisterReport(){
    let students;
    let report_param = new FeeReport();
    // this.studentService.getStudentList(this.schoolDataService.getSchool().school_id).then(respn =>{
    //   students = respn.filter(x=> x.status === 'TC');
    // })
    report_param.school_key = this.schoolDataService.getSchool().school_id;
    report_param.report_type = 'MONTHLY_PAYMENT_STATUS';
    this.feeReportService.getFeeReportByType(report_param).then(resp=>{
      if(resp){
        console.log("[FeeReportComponent] fee register loaded ", resp.length);
        // for(let student of students){
        //   this.fee_register_report = resp.filter(x=>x.monthly_payment_status_report.student_monthly_status_list.filter(y=>y.student_key !== student.student_key));
        // }
        this.fee_register_report = resp;
      }
    });
  }

  setFeeType(){
    this.fee_type = [];
    for(let data of this.due_bills_report){
      for(let student_bill of data.due_bills_report.student_bills){
        if(student_bill.overdue_bills){
          for(let bill of student_bill.overdue_bills){
            if(!this.fee_type.find(x=>x.fee_rule_key === bill.fee_rule_key)) {
              let fee_bill = new FeeBill();
              fee_bill.fee_rule_key = bill.fee_rule_key;
              fee_bill.fee_rule_name = bill.fee_rule_name;
              this.fee_type.push(fee_bill);
            }
          }
        }
      }
    }
  }

  public setFeerule(){
    let school_key = this.schoolDataService.getSchool().school_id;
    let academic_year = this.schoolDataService.getCurrentAcademicYear().code;
     this.feeruleService.getFeeRulesList(school_key).then(resp =>{
      this.filterFeeRules= resp.filter(x=>x.academic_year === academic_year);
    })
  }

  public setClasses(){
    let academic_year = this.schoolDataService.getCurrentAcademicYear().code;
    this.classes = this.classesDataService.getClasses().filter( x => x.type === "regular" && x.academic_year === academic_year)
                                                       .sort(function(a,b){return (a.order_index) - (b.order_index)});
  }

  public onDayChange(){
    this.setToDaysListFromDailyCollection();
    if(!this.fee_report_filter.to_date){
      this.fee_report_filter.to_date = this.fee_report_filter.from_date;
    }
    let dailyCollectionPipe = new DailyCollectionPipe();
    let feeReports = dailyCollectionPipe.transform(this.all_daily_collection_report, this.fee_report_filter);
    if(feeReports && feeReports.length > 0){
      if(this.fee_report_filter.fee_report_type === 'DAILY_RECEIPTS'){
          this.setReceipts(feeReports);
      }
      if(this.fee_report_filter.fee_report_type === 'DAILY_COLLECTION'){
        this.setDailyCollection(feeReports);
      }
    }
    else{
      this.daily_collection_report = null;
    }
  }

  public onToDayChange(){
    let dailyCollectionPipe = new DailyCollectionPipe();
    let feeReports = dailyCollectionPipe.transform(this.all_daily_collection_report, this.fee_report_filter);
    if(feeReports && feeReports.length > 0){
      if(this.fee_report_filter.fee_report_type === 'DAILY_RECEIPTS'){
          this.setReceipts(feeReports);
      }
      if(this.fee_report_filter.fee_report_type === 'DAILY_COLLECTION'){
        this.setDailyCollection(feeReports);
      }
    }
    else{
      this.daily_collection_report = null;
    }
  }

  private setDailyCollection(feeReports: FeeReport[]){
    this.daily_collection_report = new DailyCollectionReport();
    this.daily_collection_report.collection_items = [];
    this.daily_collection_report.total_fine_amount = 0;
    this.daily_collection_report.total_discount_amount = 0;
    for(let report of feeReports){
      for(let bill of report.daily_collection_report.collection_items){
        if(!this.daily_collection_report.collection_items.find(x=>x.name === bill.name)) {
          this.daily_collection_report.collection_items.push(bill);
        }
      }
    }
    let amount: number = 0;
    for(let bill of this.daily_collection_report.collection_items){
      this.daily_collection_report.total_fine_amount = 0;
      this.daily_collection_report.total_discount_amount = 0;
      amount = 0;
      for(let report of feeReports){
        let items = report.daily_collection_report.collection_items.filter(x=>x.code === bill.code);
        for(let item of items){
          amount = amount+item.total_amount;
        }
        this.daily_collection_report.total_fine_amount = this.daily_collection_report.total_fine_amount + report.daily_collection_report.total_fine_amount;
        this.daily_collection_report.total_discount_amount = this.daily_collection_report.total_discount_amount + report.daily_collection_report.total_discount_amount;
      }
      bill.total_amount = amount;
    }
}

getDailyCollecctionSubTotal(){
  let amount: number = 0;
  if(this.daily_collection_report){
    if(this.daily_collection_report.total_fine_amount){
      amount = this.daily_collection_report.total_fine_amount;
    }
    for(let bill of this.daily_collection_report.collection_items){
      if(bill.total_amount){
        amount = amount + bill.total_amount;
      }
    }
  }
  return amount;
}

  private setReceipts(feeReports){
    this.receipts = [];
    this.cancelled_receipts = [];
    let responses = [];
    for(let report of feeReports){;
      if(report.daily_collection_report){
        for(let receipt_key of report.daily_collection_report.fee_receipts){
          let response = this.feeReceiptService.getFeeReceipt(receipt_key).then(resp => {
            let receipt: any = resp;
            receipt.student = this.getStudent(resp.student_key);
            receipt.net_paid_amount = receipt.payments.reduce((a,b) => a.amount + b.amount).amount;
            receipt.discount = receipt.discounts ? receipt.discounts.reduce((a,b) => a.amount + b.amount).amount : 0;
            if(receipt.status==='OK'){
              this.receipts.push(receipt);
            }
            else{
              this.cancelled_receipts.push(receipt);
            }
          });
          responses.push(response);
        }
      }
    }
    Promise.all(responses).then(a => {
      this.total_receipts_net_amount = this.getTotalReceiptsPaidAmount(this.receipts);
      this.total_receipts_discount_amount = this.getTotalDiscountAmount(this.receipts);
      this.receipts.sort(function(a,b){return (a.serial_number) - (b.serial_number)});

      this.total_cancelled_receipts_net_amount = this.getTotalReceiptsPaidAmount(this.cancelled_receipts);
      this.total_cancelled_receipts_discount_amount = this.getTotalDiscountAmount(this.cancelled_receipts);
      this.cancelled_receipts.sort(function(a,b){return (a.serial_number) - (b.serial_number)});
    })
  }

  private getTotalReceiptsPaidAmount(receipts: any[]){
    let total = 0;
    for(let receipt of receipts){
      total = total + receipt.net_paid_amount;
    }
    return total;
  }

  public getTotalDiscountAmount(receipts: any[]){
    let total = 0;
    for(let receipt of receipts){
      total = total + receipt.discount;
    }
    return total;
  }

  public setDueBillsByClass(){
    this.selected_class = this.classes.find(x=>x.class_info_key === this.selected_class_info_key);
    if(this.fee_report_filter.fee_report_type === 'DUE_BILLS'){
    this.due_bills_report = this.all_due_bills_report.filter(x=>x.due_bills_report.class_key === this.selected_class.class_info_key);
    this.setFeeType();
    }
    if(this.fee_report_filter.fee_report_type === 'MONTHLY_PAYMENT_STATUS'){
      let student_type = this.fee_register_report.filter(x=>x.monthly_payment_status_report.fee_rule_key === this.fee_report_filter.fee_rule_key);
      this.fee_registers = student_type.filter(x=>x.monthly_payment_status_report.class_key === this.selected_class.class_info_key);
    }
    this.selected_division = 'All';
  }

  public setFeeRuleType(){
    if(this.fee_report_filter){
      this.fee_registers = this.fee_register_report.filter(x=>x.monthly_payment_status_report.fee_rule_key === this.fee_report_filter.fee_rule_key);
    }
    this.selected_class_info_key = 'undefined';
    this.selected_division = 'undefined';
  }


  public setDueBillsByDivision(){
    if(this.fee_report_filter.fee_report_type === 'DUE_BILLS'){
    if(this.selected_division !== 'All'){
      this.due_bills_report = this.all_due_bills_report.filter(x=>x.due_bills_report.class_key === this.selected_class.class_info_key && x.due_bills_report.division === this.selected_division && x.due_bills_report.division === this.selected_division);
    }
    else{
      this.due_bills_report = this.all_due_bills_report.filter(x=>x.due_bills_report.class_key === this.selected_class.class_info_key);
    }
    this.setFeeType();
   }
   if(this.fee_report_filter.fee_report_type === 'MONTHLY_PAYMENT_STATUS'){
     let student_type = this.fee_register_report.filter(x=>x.monthly_payment_status_report.fee_rule_key === this.fee_report_filter.fee_rule_key);
     if(this.selected_division !== 'All'){
       this.fee_registers = student_type.filter(x=>x.monthly_payment_status_report.class_key === this.selected_class.class_info_key && x.monthly_payment_status_report.division === this.selected_division);
     }
     else{
       this.fee_registers = student_type.filter(x=>x.monthly_payment_status_report.class_key === this.selected_class.class_info_key);
     }
    }
  }

  public getOverdueStudentBills(due_bills_reports: FeeReport[]): StudentBill[]{
    let student_bills = [];
    for(let fee_report of due_bills_reports){
      for(let student_bill of fee_report.due_bills_report.student_bills){
        if(student_bill.overdue_bills && student_bill.overdue_bills.length > 0){
          student_bills.push(student_bill)
        }
      }
    }
    return student_bills;
  }

  public getNoDueStudents(due_bills_reports: FeeReport[]): StudentBill[]{
    let students = [];
    for(let fee_report of due_bills_reports){
      for(let student of fee_report.due_bills_report.student_bills){
        if(!student.overdue_bills){
          students.push(student)
        }
      }
    }
    return students;
  }

  isNodue(e) {
    if (e.target.checked) {
       this.is_paid= true;
    } else {
       this.is_paid= false;
    }
  }

  public getDueMonths(student_bill,fee_rule_key){
    let bill;
    let bill_months = [];
    if(student_bill && student_bill.overdue_bills){
      bill = student_bill.overdue_bills.find(x=>x.fee_rule_key === fee_rule_key);
      if(bill && bill.fee_bills && bill.fee_bills.length > 0){
       bill.fee_bills.sort(function(a, b) {
       var dateA = (a.bill_date.split("/")[1]), dateB = (b.bill_date.split("/")[1]);
       return dateA - dateB;
      });
        for(let bills of bill.fee_bills){
         var date = bills.bill_date.split("/");
         var month = date[1];
         var day = date[0];
         var year = date[2];
         let _date =  month  + "/" +  day + "/" + year;
         let months = moment(_date).format('MMM')+"("+bills.total_amount+")"
        bill_months.push(" " + months);
       }
     }else{
       bill_months.push("-")
     }
    }
      return bill_months;
  }

  getTotalBillAmount(student_bill, fee_rule_key){
    let bill;
    this.bill_months = [];
    this.month_count = []
    if(student_bill && student_bill.overdue_bills){
      bill = student_bill.overdue_bills.find(x=>x.fee_rule_key === fee_rule_key);
      if(bill && bill.fee_bills && bill.fee_bills.length > 0){
       this.month_count = bill.fee_bills.length;
     }else{
       this.month_count = 0;
     }
      if(bill){
        return bill.total_amount;
      }
      else{
        return 0;
      }
    }
    else{
      return 0;
    }
  }

  getTotalFeeTypeDue(fee_rule_key){
    let total: number = 0;
    let bill;
    for(let data of this.due_bills_report){
     for(let student_bill of data.due_bills_report.student_bills){
      if(student_bill && student_bill.overdue_bills){
        bill = student_bill.overdue_bills.filter(x=>x.fee_rule_key === fee_rule_key);
         for(let data of bill){
          if(bill){
            total=total+parseInt(data.total_amount);
          }else{
            return 0;
          }
        }
      }
    }
  }
  return total;
 }

  getSumTotalofDueBills(){
    let sum : number = 0;
    for(let data of this.due_bills_report){
      for(let student_bill of data.due_bills_report.student_bills){
        if(student_bill && student_bill.overdue_bills){
          for(let bill of student_bill.overdue_bills){
            if(bill){
              sum = sum + parseInt(bill.total_amount);
            }
          }
        }
      }
    }
    return sum;
  }

  getTotalDue(student_bill){
    let total: number = 0;
    for(let data of student_bill.overdue_bills){
      total=total+parseInt(data.total_amount);
    }
    return total;
  }

  private setDaysListFromDailyCollection(){
    this.daysList = [];
    this.to_daysList = [];

    for(let feeReport of this.all_daily_collection_report){
      if(feeReport.report_type == "DAILY_COLLECTION"){
        let entry_date = feeReport.daily_collection_report.collection_date.substring(0,10);
        let day_entry = {
          "code": entry_date, "name": entry_date
        }
        this.daysList.push(day_entry);
        if(entry_date >= this.fee_report_filter.from_date){
          this.to_daysList.push(day_entry);
        }
      }
    }
    this.daysList.sort((a:any, b:any) => {
      if(a.code < b.code){
        return 1;
      }else if(a.code > b.code){
        return -1;
      }else{
        return 0;
      }
    })
    this.to_daysList.sort((a:any, b:any) => {
      if(a.code < b.code){
        return 1;
      }else if(a.code > b.code){
        return -1;
      }else{
        return 0;
      }
    })
  }

  private setToDaysListFromDailyCollection(){
    this.to_daysList = [];
    for(let feeReport of this.all_daily_collection_report){
      if(feeReport.report_type == "DAILY_COLLECTION"){
        let entry_date = feeReport.daily_collection_report.collection_date.substring(0,10);
        let day_entry = {
          "code": entry_date, "name": entry_date
        }
        if(entry_date >= this.fee_report_filter.from_date){
          this.to_daysList.push(day_entry);
        }
      }
    }
    this.to_daysList.sort((a:any, b:any) => {
      if(a.code < b.code){
        return 1;
      }else if(a.code > b.code){
        return -1;
      }else{
        return 0;
      }
    })
  }

  public downloadCsv(csv, student) {
    var csvFile;
    var downloadLink;
    csvFile = new Blob([csv], {type: "text/csv"});
    downloadLink = document.createElement("a");
    downloadLink.download = student;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  public export_table_to_csv(student) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");
    for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll("td, th");
      for (var j = 0; j < cols.length; j++)
      row.push(cols[j].textContent);
      csv.push(row.join(","));
    }
    this.downloadCsv(csv.join("\n"), student);
  }

  printDue(): void {
    let printContents, popupWin;
    if(this.fee_report_filter.fee_report_type === 'DUE_BILLS'){
      printContents = document.getElementById('due_bills_print').innerHTML;
    }
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
          table.table2{
               font-family: arial, sans-serif;
               border-collapse: collapse;
               width: 100%;
               font-size: 100%;
          }
          table.table1 td, th{
              border: 1px solid #424242;
              text-align: left;
              padding-left: 4px;
              padding-right: 4px;
              height: 30px;
          }

          table.table2 td {
              border: 1px solid black;
          }
          table.table2 tr:first-child td {
              border-top: 0;
          }
          table.table2 tr td:first-child {
             border-left: 0;
          }
          table.table2 tr:last-child td {
             border-bottom: 0;
          }
          table.table2 tr td:last-child {
             border-right: 0;
          }
          .pull-right{
            text-align: right;
          }
          .padding{
            padding-top: 5px;
            padding-bottom: 5px;
          }
          .value{
             border-top: 2px solid black;
          }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  printCancelledReceipts(): void {
    let printContents, popupWin;
    if(this.fee_report_filter.fee_report_type === 'DAILY_RECEIPTS'){
      printContents = document.getElementById('cancelled_receipt_print').innerHTML;
    }
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
              padding: 5px;
          }
          .value{
             border-top: 2px solid black;
          }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  print(): void {
    let printContents, popupWin;
    if(this.fee_report_filter.fee_report_type === 'DAILY_COLLECTION'){
      printContents = document.getElementById('daily_collection_div').innerHTML;
    }
    if(this.fee_report_filter.fee_report_type === 'DAILY_RECEIPTS'){
      printContents = document.getElementById('receipt_print').innerHTML;
    }
    if(this.fee_report_filter.fee_report_type === 'MONTHLY_PAYMENT_STATUS'){
      printContents = document.getElementById('fee_register_print').innerHTML;
    }
    if(this.fee_report_filter.fee_report_type === 'DUE_BILLS'){
      printContents = document.getElementById('no_due_print').innerHTML;
    }
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
              padding: 5px;

          }
          .pull-right{
            text-align: right;
          }
          .font{
            font-size: 18px;
          }
          .value{
             border-top: 2px solid black;
          }
          .align{
            text-align: right;
          }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }



}
