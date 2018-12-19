import { Component, OnInit, Input } from '@angular/core';
import { FeeReceiptService } from './fee-receipt.service';
import { FeeReceipt } from './fee-receipt';
import * as moment from 'moment';
import { FeeBillService } from '../fee-bill.service';
import { FeeBill } from '../fee-bill';
import { SchoolDataService } from '../../../management/school/school-data.service';
import { ClassesDataService } from '../../../academics/classes/classes-data.service';
import { School } from '../../../management/school/school';
import { StudentService } from '../../../student/student.service';
import { Student } from '../../../student/student';

@Component({
  selector: 'app-fee-receipt',
  templateUrl: './fee-receipt.component.html',
  styleUrls: ['./fee-receipt.component.css']
})
export class FeeReceiptComponent implements OnInit {

  @Input() receipt_key;

  fee_receipt: FeeReceipt;
  fee_bills: FeeBill[];
  school: School;
  student: Student;
  todays_date: String;
  currencyCode: string;

  constructor(private feeReceiptService: FeeReceiptService,
              private feeBillService: FeeBillService,
              private schoolDataService: SchoolDataService,
              private studentService: StudentService,
              private classesDataService: ClassesDataService ) { }

  ngOnInit() {
    this.todays_date = moment().format('Do MMM YYYY');
    this.school = this.schoolDataService.getSchool();
    this.currencyCode = this.schoolDataService.getCurrencyCode();
    this.feeReceiptService.getFeeReceipt(this.receipt_key).then(resp => {
      this.fee_receipt = resp;
      for (let fee_bill_key of this.fee_receipt.fee_bills){
        this.feeBillService.getFeeBill(fee_bill_key).then(resp => {
          if(!this.fee_bills){
            this.fee_bills = []
          }
          this.fee_bills.push(resp);
        })
      }
    }).then(resp => {
      this.studentService.getStudent(this.fee_receipt.student_key).then(resp => {
        this.student = resp;
      })
    });
    this.fee_bills = [];
  }

  public getTotalBillAmount() {
    return this.fee_bills.map(function (item) { return Number(item.total_amount); }).
      reduce(function (a, b) { return a + b; }, 0);
  }

  public getAcademicYear(class_key){
    return this.classesDataService.getClasses().find(x => x.class_info_key === class_key).academic_year
  }

  public getNetTotalAmount() {
    let total_amount = this.getTotalBillAmount();
    if(this.fee_receipt.discounts && this.fee_receipt.discounts.length > 0){
      for( let discount of this.fee_receipt.discounts){
        total_amount = total_amount - discount.amount;
      }
    }
    return total_amount;
  }

}
