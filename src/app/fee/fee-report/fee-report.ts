export class FeeReport {
  fee_report_key: string;
  report_type: string;
  period_type: string;
  school_key: string;
  last_updated_date: string;
  from_date: string;
  to_date: string;
  daily_collection_report: DailyCollectionReport;
  monthly_payment_status_report: MonthlyPaymentStatusReport;
  due_bills_report: DueBillsReport;
}

export class MonthlyPaymentStatusReport{
  class_key: string;
  class_name: string;
  division: string;
  fee_rule_key: string;
  student_monthly_status_list: StudentMonthlyStatus[];
}

export class StudentMonthlyStatus{
  admission_number: string;
  student_key: string;
  student_name: string;
  monthly_status_list: MonthlyStatusList[];
}

export class MonthlyStatusList{
  amount: number;
  fee_bill_key: string;
  month: string;
  receipt_date: string;
  receipt_key: string;
  receipt_number: number;
  status: string;
}

export class DailyCollectionReport {
  collection_date: string;
  total_collection_amount: number;
  total_fine_amount: number;
  total_discount_amount: number;
  fee_receipts: string[];
  collection_items: DailyCollectionItem[];
}

class DueBillsReport{
  class_key: string;
  class_name: string;
  division: string;
  student_bills: StudentBill[];
}

export class StudentBill{
  admission_number: string;
  new_bills: Bill[] = [];
  overdue_bills: Bill[] = [];
  paid_bills: Bill[] = [];
  student_key: string;
  student_name: string;
}

class Bill{
  fee_bills: FeeBill[] = [];
  fee_rule_key: string;
  fee_rule_name: string;
  total_amount: string;
}

export class FeeBill{
  bill_date: string;
  fee_bill_key: string;
  total_amount: string;
}

export class DailyCollectionItem {
  code: string;
  total_amount: number;
  name: string;
}
