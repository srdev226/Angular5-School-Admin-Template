import { Pipe, PipeTransform } from '@angular/core';
import { FeeReportFilter } from './fee-report-filter';
import { FeeBill } from '../fee-bill/fee-bill';
import { BillCollection } from '../fee-bill/bill-collection';


@Pipe({
  name: 'FeeReportPipe'
})
export class FeeReportPipe implements PipeTransform {

  private MONTHS = ["Jan","Feb","Mar","Apr","May","June","Jul","Aug","Sep","Oct","Nov","Dec"];

  transform(filter: FeeReportFilter, fee_bills: FeeBill[] ): BillCollection[] {
    console.log('[FeeReportPipe] loading with filter ', filter.institution_key, filter.fee_rule_key);
    if(fee_bills)
      return this.getFeeReport(filter, fee_bills);
  }

  private getFeeReport(filter: FeeReportFilter, fee_bill_list: FeeBill[]){
    let fee_bills: FeeBill[] = [];
    let filtered_fee_bills: FeeBill[] = fee_bill_list;
    if(filter.fee_rule_key && filter.fee_rule_key !== 'undefined'){
      console.log('[FeeReportPipe] checking with fee rule key ', filter.fee_rule_key );
      for(let fee_bill of filtered_fee_bills){
        if(fee_bill.fee_rule_key === filter.fee_rule_key){
          fee_bills.push(fee_bill);
        }
      }
      filtered_fee_bills = fee_bills;
    }
    if(filter.institution_key && filter.institution_key !== 'undefined'){
      console.log('[FeeReportPipe] checking with inst key ', filter.institution_key);
      fee_bills = [];
      for(let fee_bill of filtered_fee_bills){
        if(fee_bill.institution_key === filter.institution_key){
          fee_bills.push(fee_bill);
        }
      }
    }
    if(fee_bills && fee_bills.length > 0){
      return this.getMonthlyFeeCollectionData(fee_bills);
    }
  }

  private getMonthlyFeeCollectionData(fee_bill_list: FeeBill[]): BillCollection[]{
    let bill_collection = []
    let bills_map = this.getInitiallisedCollectionData(fee_bill_list);
    for(let fee_bill of fee_bill_list){
      let bill_date = this.getAsDate(fee_bill.bill_date);
      let hash_key = +(String(bill_date.getFullYear()) + String(bill_date.getMonth())) ;
      let bill_collection_item = bills_map.get(hash_key);
      if(!bill_collection_item){
        console.log('[FeeBillService] ERROR could not find bill collection data : ');
      }
      bill_collection_item.bills_amount_total = bill_collection_item.bills_amount_total + fee_bill.total_amount;
      if(fee_bill.status === 'DUE' || fee_bill.status === 'OVERDUE')
      bill_collection_item.bills_amount_due = bill_collection_item.bills_amount_due + fee_bill.total_amount;
      if(fee_bill.status === 'PAID'){
        bill_collection_item.bills_amount_collected = bill_collection_item.bills_amount_collected + fee_bill.total_amount;
      }
      if(fee_bill.status === 'OVERDUE'){
        bill_collection_item.overdue_bills_count = bill_collection_item.overdue_bills_count + 1;
      }
    }
    return Array.from(bills_map.values());
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
    //new date object created for copy instead of reference
    let bill_collection_date = new Date();
    bill_collection_date.setTime(earliest_date.getTime());

    while(bill_collection_date <= latest_date){
      console.log('[FeeReportPipe] dates : ', bill_collection_date, latest_date);
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

}
