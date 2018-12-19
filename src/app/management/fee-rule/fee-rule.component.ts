import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FeeRule } from './fee-rule';
import { FeeRuleResponse } from './fee-rule-response';

@Component({
  selector: 'app-fee-rule',
  templateUrl: './fee-rule.component.html',
  styleUrls: ['./fee-rule.component.css']
})
export class FeeRuleComponent implements OnInit {

  feeRule: FeeRule = new FeeRule();

  isSuccess: boolean = false;

  constructor(public router: Router) { }

  ngOnInit() {
    this.router.navigate(["manage/fee-rule/list"]);
  }

}
