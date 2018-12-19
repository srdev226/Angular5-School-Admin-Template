import { Pipe, PipeTransform } from '@angular/core';
import { FeeReportFilter } from './fee-report-filter';
import { FeeBill } from '../fee-bill/fee-bill';
import { FeeReceipt } from '../fee-bill/fee-receipt/fee-receipt';
import { FeeReport } from './fee-report';

@Pipe({
  name: 'dailyCollection',
  pure: false
})
export class DailyCollectionPipe implements PipeTransform {

  transform( fee_reports: FeeReport[], filter: FeeReportFilter): FeeReport[] {
    let result;
    if(!filter.from_date && !filter.to_date){
      result = [];
    }
    else{
      result = fee_reports;
      if(filter.from_date){
        result = result.filter(x => x.daily_collection_report && x.daily_collection_report.collection_date >= filter.from_date);
      }
      if(filter.to_date){
        result = result.filter(x => x.daily_collection_report && x.daily_collection_report.collection_date <= filter.to_date);
      }
    }
    return result;
  }

}
