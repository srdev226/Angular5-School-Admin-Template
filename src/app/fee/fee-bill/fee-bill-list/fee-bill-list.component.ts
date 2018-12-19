import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';
import { FeeBill, AuditLog } from '../../fee-bill/fee-bill';
import { FeeBillService } from '../../fee-bill/fee-bill.service';
import { FeeReceiptService } from '../fee-receipt/fee-receipt.service';
import { FeeReceipt } from '../fee-receipt/fee-receipt';

import { SchoolDataService } from '../../../management/school/school-data.service';
import { Student } from '../../../student/student';
import { StudentService } from '../../../student/student.service';
import { InstitutionService } from '../../../management/institution/institution.service';
import { NotificationService } from '../../../notification/notification.service';
import { Messaging} from '../../../messaging/messaging';
import { MessagingService } from '../../../messaging/messaging.service';

import { NotificationsService as AngNotifications }  from 'angular2-notifications';

import { PaymentRequest, Payment, Discount } from '../payment-request';

enum PageStateType {FEE_BILL_LIST,FEE_BILL_CONFIRM,RECEIPT,RECEIPT_LIST}

export class PageState{
  constructor(public type: PageStateType){}
}

@Component({
  selector: 'app-fee-bill-list',
  templateUrl: './fee-bill-list.component.html',
  styleUrls: ['./fee-bill-list.component.css']
})

export class FeeBillListComponent implements OnInit {

  pageStateType = PageStateType;
  pageState: PageState;

  feeBills: FeeBill[];
  uiFeeBills: any[];
  studentFilteredFeeBills: FeeBill[];
  private _student: Student;
  paid_bills_data: any[];
  todays_date: String;
  currencyCode: string;
  messaging: Messaging;

  receipt_key: string;
  discount: Discount;
  is_cancel_receipt: boolean = false;
  receipt_status: string;
  cancel_reason: string = "";

  @Output() onDone = new EventEmitter();

  public notification_options = {
    position: ["bottom", "right"],
    timeOut: 5000,
    lastOnBottom: true
  };

  constructor(private router: Router,
    private feeBillService: FeeBillService,
    private schoolDataService: SchoolDataService,
    private studentService: StudentService,
    private institutionService: InstitutionService,
    private notificationService: NotificationService,
    private messagingService: MessagingService,
    private feeReceiptService: FeeReceiptService,
    private _service: AngNotifications) { }

  ngOnInit() {
    this.todays_date = moment().format('Do MMM YYYY');
    this.currencyCode = this.schoolDataService.getCurrencyCode();
    this.studentFilteredFeeBills = [];
    this.paid_bills_data = [];
    this.discount = new Discount();
    this.discount.amount = 0;
    this.setPageState(PageStateType.FEE_BILL_LIST);
  }

  public onReceiptSelected(receipt_key: string){
    this.is_cancel_receipt = false;
    this.receipt_key = receipt_key;
    this.feeReceiptService.getFeeReceipt(this.receipt_key).then(resp=>{
      this.receipt_status = resp.status;
    })
    this.setPageState(PageStateType.RECEIPT);
  }

  public showReceipts(){
    this.setPageState(PageStateType.RECEIPT_LIST);
  }

  public showFeeBills(){
    this.setStudentFeeBills(this._student.student_key);
    this.setPageState(PageStateType.FEE_BILL_LIST);
  }

  updateFeeBillSelection(filter, e) {
    if (e.target.checked) {
      for (let ui_fee_bill of this.uiFeeBills) {
        if (ui_fee_bill.status.toUpperCase() == filter) {
          ui_fee_bill.selected = true;
        }
      }
    } else {
      for (let ui_fee_bill of this.uiFeeBills) {
        if (ui_fee_bill.status.toUpperCase() == filter) {
          ui_fee_bill.selected = false;
        }
      }
    }
    this.refreshSelectedBills();
  }

  private setPageState(page_state_type){
    this.pageState = new PageState(page_state_type);
  }

  @Input()
  set student(student: Student) {
    this._student = student;
    this.setStudentFeeBills(student.student_key);
  }

  get student() {
    return this._student;
  }

  setStudentFeeBills(studentKey) {
    this.feeBillService.getFeeBillListByStudent(studentKey).then(resp => {
      this.feeBills = resp;
      this.uiFeeBills = [];
      for (let feeBill of this.feeBills) {
        let fb: any = feeBill;
        fb.selected = false;
        this.uiFeeBills.push(fb);
      }
      this.uiFeeBills.sort(function(a,b){
        a =  new Date(a.pay_by_date);
        b =  new Date(b.pay_by_date);
        return a-b;
      })
    });
  }

  getLayoutClasses() {
    if (this.pageState.type === PageStateType.FEE_BILL_CONFIRM) {
      return "col-lg-12 col-md-12 col-sm-12 col-xs-12";
    } else {
      return "col-lg-9 col-md-9 col-sm-6 col-xs-12";
    }
  }

  showConfirmationScreen() {
    this.setPageState(PageStateType.FEE_BILL_CONFIRM)
  }

  gobackToBills() {
    this.refreshSelectedBills();
    this.setPageState(PageStateType.FEE_BILL_LIST)
    this.paid_bills_data = [];
  }

  getTotalAmount() {
    return this.studentFilteredFeeBills.map(function (item) { return Number(item.total_amount); }).
      reduce(function (a, b) { return a + b; }, 0)
  }

  public getStudentProfilePicURL(profile_image_key, gender) {
    let url = '';
    if (profile_image_key) {
      url = this.studentService.getProfilePictureUrl(profile_image_key);
    } else if (gender == 'Male') {
      url = 'assets/images/boy.png';
    } else {
      url = 'assets/images/girl.png';
    }
    return url;
  }

  public payBills() {
    if (this.discount.amount > this.getTotalAmount()){
      this.showErrorNotification('Error','Please enter a valid discount amount');
    }else{
    let payment_request = this.getPayBillsRequest();
    if(payment_request.receipt_serial_key){
      this.feeBillService.payFeeBills(payment_request).then( resp => {
        console.log('[FeeBillListComponent] Bills paid, Receipt key ', resp.receipt_key)
        this.receipt_key = resp.receipt_key;
        this.sendPaidBillNotification(this._student, resp.receipt_key);
        this.setPageState(PageStateType.RECEIPT);
      }).catch(resp => {
        this.showErrorNotification('Error','Fee Bill payment could not be completed due to server error');
      })
    }else{
      console.log('No receipt serial key present. Can not pay bills')
      this.showErrorNotification('Error','Fee Bill payment could not be done as receipt generation is not setup');
    }
    this.studentFilteredFeeBills = [];
   }
  }

  private getPayBillsRequest(){
    let payment_request = new PaymentRequest();
    let fee_bill_keys = [];
    for (let fee_bill of this.studentFilteredFeeBills) {
      fee_bill_keys.push(fee_bill.fee_bill_key);
    }
    payment_request.fee_bills = fee_bill_keys;

    let receipt_serial_key = undefined;
    if(this.schoolDataService.getSchool().fee_configuration){
      receipt_serial_key = this.schoolDataService.getSchool().fee_configuration.receipt_serial_key;
      payment_request.receipt_serial_key = receipt_serial_key;
    }

    let payments = [];
    let payment = new Payment();
    payment.mode = 'CASH';
    payment.amount = this.getTotalAmount();

    if(this.discount && this.discount.amount > 0){
      let discounts = [];
      this.discount.code = 'CUSTOM';
      discounts.push(this.discount);
      payment_request.discounts = discounts;
      payment.amount = payment.amount - this.discount.amount;
    }
    payments.push(payment);
    payment_request.payments = payments;
    return payment_request;
  }

  private sendPaidBillNotification(student: Student, receipt_key: string) {
    let messaging = new Messaging();
    let notification_number = student.notification_mobile_numbers[0];
    this.feeReceiptService.getFeeReceipt(receipt_key).then(resp => {
        let receipt = resp;
        let msg = this.getPaidBillMessage(this.schoolDataService.getSchool().name, student.full_name, this.getTotalReceiptAmount(receipt),
            receipt.serial_number, receipt.receipt_date);
        let message = this.getPaidBillSms(this.schoolDataService.getSchool().name, student.full_name, this.getTotalReceiptAmount(receipt),
            receipt.serial_number, receipt.receipt_date)
        let to_identifier = notification_number.country_code + notification_number.phone_number;
        messaging.title = "Fee Notification";
        messaging.time_stamp = moment().format();
        messaging.message = msg;
        messaging.sender_key = this.schoolDataService.getSchool().school_id;
        messaging.sender_type = "SCHOOL";
        messaging.receiver_key = student.student_key;
        messaging.receiver_type = "STUDENT";
        messaging.thread_key = "thread_key";

        this.messagingService.addMessage(messaging).then(resp => {
            messaging.message_key = resp.message_key;
            console.log('[FeeBillListComponent] FeePayment app notification - message - ', messaging.message, ' title ', messaging.title, 'student_key', messaging.receiver_key);
        }).catch(resp => {
            this.showWarningNotification("Message Not send", "Server Error");
        })
        this.messaging = messaging;

        if (student.notification_mobile_numbers && student.notification_mobile_numbers.length > 0) {
            this.notificationService.sendSMSMessage(message, to_identifier).then(resp => {
                console.log('[FeeBillListComponent] FeePayment SMS  - message - ', message, ' to_identifier ', to_identifier);
            }).catch(resp => {
                this.showWarningNotification("SMS Not sent", "Server Error");
            })
        } else {
            this.showWarningNotification("SMS Not sent", "No SMS notification number available");
        }
    });
}

  private getTotalReceiptAmount(receipt){
    let total_payment = receipt.payments.reduce((a,b) => ({total: a.amount + b.amount}));
    return total_payment.amount;
  }

  private getPaidBillMessage(school_name, student_name, total_amount, receipt_number, receipt_date){
    receipt_date = moment(receipt_date).format('LL');
    let msg = " INR " + total_amount + " paid against school fee for " + student_name +
              ", Receipt# " + receipt_number + " on " + receipt_date;
    console.log('[FeeBillListComponent] msg length ', msg.length);
    return msg;
  }

  private getPaidBillSms(school_name, student_name, total_amount, receipt_number, receipt_date){
    receipt_date = moment(receipt_date).format('LL');
    school_name = school_name.length > 30 ? school_name.substring(0,30) : school_name;
    let msg = "[" + school_name + "]" + " INR " + total_amount + " paid against school fee for " + student_name +
              ", Receipt# " + receipt_number + " on " + receipt_date;
    console.log('[FeeBillListComponent] msg length ', msg.length);
    return msg;
  }

  private getAuditLogs() {
    let auditLogs = [];
    let auditLog = new AuditLog();
    auditLogs.push(auditLog);
    auditLog.date = new Date().toISOString();
    auditLog.message = 'Paid the bill at admin office';
    return auditLogs;
  }

  public showSearch() {
    this.onDone.emit();
  }

  private cancelReceipt(){
     let receipt = new FeeReceipt();
     receipt.receipt_key = this.receipt_key;
     this.feeBillService.cancelReceipt(receipt).then(resp => {
       console.log('Receipt cancelled - '+this.receipt_key);
       this.showNotification("Success","Receipt cancelled");
       this.showReceipts();
     }).catch( x => {
         console.error('[FeeBillListComponent] receipt could not be cancelled');
         this.showErrorNotification('Error','Receipt could not be cancelled');
     });
     this.is_cancel_receipt = false;
   }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('receipt_div').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
           .header{
             text-align:center;
             padding:1px;
             background-color:#3ED783;
             color:#fff;
           }
            .inline{
              display:inline-block;
              font-size:15px;

            }
            .inline-right{
              float:right;
              font-size:15px;

            }
            .table{
              cellpadding:10;
              cellspacing:10;
              border-collapse: collapse;
              width:100%;
              font-size:14px;
            }

            .border{
              border-top: 1px groove;
            }
            .right{
              text-align: right;
            }
            .centre{
              text-align:center;

            }
            .signature{
              text-align:right;
              padding-top:30px;
              padding-bottom:30px;

            }
           .net-total{
              text-align: right;
              font: medium bold;
              padding: 10px 0px;
              border-top: 1px solid;
              border-bottom: 1px solid;
            }
           .font{
              font-family:Calibri !important;
            }


          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  refreshSelectedBills() {
    this.studentFilteredFeeBills = [];
    let selectedBills: any[] = this.uiFeeBills.filter(uiFeeBill => (uiFeeBill.selected == true && uiFeeBill.status != 'PAID'));
    for (let ui_fee_bill of selectedBills) {
      let feeBill: FeeBill[] = this.feeBills.filter(fb => (fb.fee_bill_key == ui_fee_bill.fee_bill_key));
      this.studentFilteredFeeBills.push(feeBill[0]);
    }
  }

  private showNotification(msg_type, message){
    const toast = this._service.success(msg_type, message, {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

  private showErrorNotification(msg_type, message){
    const toast = this._service.error(msg_type, message, {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

  private showWarningNotification(msg_type, message){
    const toast = this._service.warn(msg_type, message, {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

}

@Pipe({ name: 'billsFilter' })
export class BillsFilterPipe implements PipeTransform {
  transform(allBills: any[], status: string) {
    if (!allBills) {
      return [];
    }
    return allBills.filter(fee_bill => (fee_bill.status == status));
  }
}
