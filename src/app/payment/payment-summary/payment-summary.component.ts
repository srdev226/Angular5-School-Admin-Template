import { Component, OnInit, Input } from '@angular/core';
import { PaymentInfo, PaymentSummaryData } from '../payment-info';

@Component({
  selector: 'app-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.css']
})
export class PaymentSummaryComponent implements OnInit {

  constructor() { }

  @Input() summaryData: PaymentSummaryData;

  ngOnInit(){}

}
