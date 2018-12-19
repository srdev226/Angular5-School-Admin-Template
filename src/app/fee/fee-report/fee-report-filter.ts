export class FeeReportFilter {

  fee_rule_key: string;
  institution_key: string;
  fee_report_type: string;
  fee_report_types = [{code: "DAILY_COLLECTION", name: "Daily Collection"},
                      {code: "DAILY_RECEIPTS", name: "Daily Receipts"},
                      // {code: "YEARLY_REPORTS", name: "Yearly Reports"},
                      {code: "DUE_BILLS", name: "Due Bills"},
                      {code: "MONTHLY_PAYMENT_STATUS", name: "Fee Register"},
                      {code: "COLLECTION SUMMARY", name: "Collection Summary"}];
  from_date: string;
  to_date: string;

}
