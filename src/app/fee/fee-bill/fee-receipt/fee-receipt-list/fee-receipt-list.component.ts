import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FeeReceipt } from '../fee-receipt';
import { FeeBill} from '../../fee-bill';
import { SchoolDataService } from '../../../../management/school/school-data.service';

import { FeeReceiptService } from '../fee-receipt.service';
import * as moment from 'moment';

@Component({
  selector: 'app-fee-receipt-list',
  templateUrl: './fee-receipt-list.component.html',
  styleUrls: ['./fee-receipt-list.component.css']
})
export class FeeReceiptListComponent implements OnInit {

  currencyCode: string;

  @Input() student_key: string;
  @Output() on_receipt_selected = new EventEmitter<string>();

  fee_receipt_list: FeeReceipt[] = [];


  constructor(private feeReceiptService: FeeReceiptService,
  private schoolDataService: SchoolDataService){ }

  ngOnInit() {
    this.currencyCode = this.schoolDataService.getCurrencyCode();
    this.feeReceiptService.getFeeReceiptByStudent(this.student_key).then(resp => {
      this.fee_receipt_list = resp;
    });
  }

  public getNetTotalReceiptAmount(receipt){
    let total_payment = receipt.payments.reduce((a,b) => ({total: a.amount + b.amount}));
    return total_payment.amount;
  }

  public showReceiptDetails(receipt_key){
    this.on_receipt_selected.emit(receipt_key);
  }

}
