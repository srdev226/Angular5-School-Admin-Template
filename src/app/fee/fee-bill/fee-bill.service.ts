import { Injectable } from '@angular/core';
import {
  Headers,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { FeeBillHttpClient } from './fee-bill-http-client';
import { FeeReceipt} from './fee-receipt/fee-receipt';
import { FeeBill, AuditLog } from './fee-bill';
import { Student } from '../../student/student';
import { BillCollection } from './bill-collection';
import { PaymentRequest } from './payment-request';
import {environment} from '../../../environments/environment';

@Injectable()
export class FeeBillService {

  private feebillUrl = environment.feebillServiceUrl;
  private partnerKey = environment.partnerKey;
  private MONTHS = ["Jan","Feb","Mar","Apr","May","June","Jul","Aug","Sep","Oct","Nov","Dec"];

  constructor(private http: FeeBillHttpClient) { }


  payFeeBills(paymentRequest: PaymentRequest): Promise<any>{
    paymentRequest.partner_key = this.partnerKey;

    let data = JSON.stringify(paymentRequest);

    return this.http.post(this.feebillUrl + '/paybills', data)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  updateFeeBillStatus(feeBill: FeeBill): Promise<any> {

    let updateFeeBill: FeeBill = new FeeBill();
    updateFeeBill.fee_bill_key = feeBill.fee_bill_key;
    updateFeeBill.status = feeBill.status;

    let data = JSON.stringify(updateFeeBill);

    return this.http.post(this.feebillUrl + '/updatestatus', data)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  public cancelReceipt(receipt: FeeReceipt): Promise<any> {
     return this.http.post(this.feebillUrl + '/cancel/receipt', receipt)
     .toPromise()
     .then(this.extractData)
     .catch(this.handleError);
   }

  addFeeBillAuditLog(feeBillKey: string, auditLogs: AuditLog[]): Promise<any> {

    let auditLogFeeBill: FeeBill = new FeeBill();
    auditLogFeeBill.fee_bill_key = feeBillKey;
    auditLogFeeBill.audit_logs = auditLogs;

    let data = JSON.stringify(auditLogFeeBill);

    return this.http.post(this.feebillUrl + '/updateauditlogs', data)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }

  getFeeBillList(school_key: string): Promise<FeeBill[]>{

    let url = this.feebillUrl + "/list/" + school_key;

    return this.http.get(url)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError)
  }

  getFeeBillListByStudent(student_key: string): Promise<FeeBill[]>{

    let url = this.feebillUrl + "/list/student/" + student_key;

    return this.http.get(url)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError)
  }

  getFeeBill(fee_bill_key: string): Promise<FeeBill>{

    let url = this.feebillUrl + "/" + fee_bill_key;

    return this.http.get(url)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError)
  }

  getBillCollectionData(school_key: string): Promise<BillCollection[]>{
    let fee_bill_list = [];
    let bill_collection_list = [];
    return this.getFeeBillList(school_key).then(resp => {
      fee_bill_list = resp;
      return fee_bill_list;
    }).then(fee_bill_list => {
      return this.getMonthlyFeeCollectionData(fee_bill_list);
    });
  }

  private getMonthlyFeeCollectionData(fee_bill_list: FeeBill[]): BillCollection[]{
    let bill_collection = []
    let bills_map = this.getInitiallisedCollectionData(fee_bill_list);
    for(let fee_bill of fee_bill_list){
      let bill_date = this.getAsDate(fee_bill.bill_date);
      let hash_key = +(String(bill_date.getFullYear()) + String(bill_date.getMonth())) ;
      let bill_collection_item = bills_map.get(hash_key);
      if(bill_collection_item){
        bill_collection_item.bills_amount_total = bill_collection_item.bills_amount_total + fee_bill.total_amount;
        if(fee_bill.status === 'DUE' || fee_bill.status === 'OVERDUE')
        bill_collection_item.bills_amount_due = bill_collection_item.bills_amount_due + fee_bill.total_amount;
        if(fee_bill.status === 'PAID'){
          bill_collection_item.bills_amount_collected = bill_collection_item.bills_amount_collected + fee_bill.total_amount;
        }
        if(fee_bill.status === 'OVERDUE'){
          bill_collection_item.overdue_bills_count = bill_collection_item.overdue_bills_count + 1;
          this.addToStudentsList(fee_bill,bill_collection_item);
        }
      }
    }
    return Array.from(bills_map.values());
  }

  private addToStudentsList(fee_bill, bill_collection_item){
    if(!this.isStudentPresent(bill_collection_item.overdue_students_list,fee_bill.student_key)){
      let student = new Student();
      student.student_key = fee_bill.student_key;
      student.full_name = fee_bill.student_name;
      bill_collection_item.overdue_students_list.push(student);
    }
  }

  private isStudentPresent(student_list, student_key){
    for(let st of student_list){
      if(st.student_key == student_key){
        return true;
      }
    }
    return false;
  }

  private getInitiallisedCollectionData(fee_bill_list: FeeBill[]): Map<number,BillCollection>{
    let earliest_date;
    let latest_date;
    for(let fee_bill of fee_bill_list){
      let fee_bill_date = this.getAsDate(fee_bill.bill_date);
      if(!earliest_date){
        earliest_date = fee_bill_date;
        latest_date = fee_bill_date;
      }
      if(fee_bill_date < earliest_date){
        earliest_date = fee_bill_date;
      }
      if(fee_bill_date > latest_date){
        latest_date = fee_bill_date;
      }
    }
    let bills_map = new Map<number,BillCollection>();
    let bill_collection_date = earliest_date;
    while(bill_collection_date <= latest_date){
      let bill_collection_item = new BillCollection();
      let hash_key = +(String(bill_collection_date.getFullYear()) + String(bill_collection_date.getMonth())) ;
      bill_collection_item.month = this.MONTHS[bill_collection_date.getMonth()];
      bill_collection_item.year = bill_collection_date.getFullYear();
      bills_map.set(hash_key, bill_collection_item);

      bill_collection_date.setMonth(bill_collection_date.getMonth() + 1);
    }
    return bills_map;
  }

  //Assumes dd/MM/YYYY format
  private getAsDate(input_date){
    let date_parts = input_date.split('/');
    let result_date = new Date(date_parts[2],date_parts[1]-1,date_parts[0]);//ISO format YYYY-MM-DD
    return result_date;
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

  private handleError(error: any): Promise<any> {
    let message : any = "";
    message = Observable.throw(new Error(error.status));
    return message;
  }

}
