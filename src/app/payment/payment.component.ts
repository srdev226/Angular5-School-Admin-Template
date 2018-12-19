import { Component, OnInit } from '@angular/core';

import { PaymentInfo, PaymentSummaryData } from './payment-info';
import { AdmissionApplication, ApplicationData } from '../application-list/admission-application';
import { School } from '../management/school/school';

import { PaymentService } from './payment.service';
import { AdmissionService } from '../application-list/admission.service';
import { SchoolService } from '../management/school/school.service';
import { StudentService } from '../student/student.service';
import { SchoolDataService } from '../management/school/school-data.service';
import { UserAccountDataService } from '../user-account/user-account-data.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  applicationList: ApplicationData[] = [];
  admission_application: AdmissionApplication[] = [];

  school: School = new School();

  payments: PaymentInfo[] = [];
  summaryData: PaymentSummaryData[] = [];
  schoolID: string;
  noOfApplications: number = 0;
  totalApplicationFee: number = 0;
  totalAmountSettled: number = 0;
  totalAmountPending: number = 0;

  constructor(private admissionService: AdmissionService,
    private schoolService: SchoolService,
    private userAccountDataService: UserAccountDataService,
    private schoolDataService: SchoolDataService,
    private studentService: StudentService,
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
    this.schoolID = this.userAccountDataService.getUserAccount().school_key;
    this.school = this.schoolDataService.getSchool();

    this.getApplicationList();
  }

  getApplicationList(): void {
    if (this.schoolID) {
      this.admissionService.getApplicationsBySchool(this.schoolID)
        .then(app_resp => {
          this.applicationList = app_resp;
        }).then(() => {
          for (let applicationData of this.applicationList) {

            if(applicationData.payment_status === 'success'){
              this.noOfApplications++;
            }
            if(this.applicationList.indexOf(applicationData) === (this.applicationList.length-1)){
              this.getPaymentSummary();
            }
          }
        });
    }
  }

    getPaymentSummary(){

      let fee : number = parseInt(this.school.admissions.application_fee);
      this.totalApplicationFee = this.noOfApplications * fee;
      this.noOfApplications = 0;
      this.totalAmountSettled = 0;

      let i : number = 0;
      let j: number = 1;

      for (let applicationData of this.applicationList) {
        if(applicationData.payment_status === 'success'){
          this.noOfApplications++;
        }

        if(applicationData.payments){
          j=1;
          for (let payment_key of applicationData.payments) {
            this.paymentService.getPayment(payment_key).then(resp=>{
              if(resp.status === 'success'){
                this.totalAmountSettled = this.totalAmountSettled + resp.amount;
                this.payments.push(resp);
                if(i === this.applicationList.length && j === applicationData.payments.length){
                  this.totalAmountPending = this.totalApplicationFee - this.totalAmountSettled;
                  this.setPaymentSummaryData();
                }
              }
            });
            j++;
          }
        }
        i++;
      }
    }

    setPaymentSummaryData(){
      let summary : PaymentSummaryData = new  PaymentSummaryData();
      this.summaryData = [];
      summary.class = 'violet';
      summary.detail = 'Applications';
      summary.count = this.noOfApplications.toString();
      summary.icon = 'fa-user';
      this.summaryData.push(summary);

      summary = new  PaymentSummaryData();
      summary.class = 'blue';
      summary.detail = 'Fee Amount';
      summary.count = this.totalApplicationFee.toString();
      summary.icon = 'fa-inr';
      this.summaryData.push(summary);

      summary = new  PaymentSummaryData();
      summary.class = 'green';
      summary.detail = 'Amount Settled';
      summary.count = this.totalAmountSettled.toString();
      summary.icon = 'fa-check';
      this.summaryData.push(summary);

      summary = new  PaymentSummaryData();
      summary.class = 'red';
      summary.detail = 'Pending amount';
      summary.count = this.totalAmountPending.toString();
      summary.icon = 'fa-warning';
      this.summaryData.push(summary);
    }
  }
