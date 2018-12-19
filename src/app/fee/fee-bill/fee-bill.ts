export class FeeBill {

  fee_bill_key: string;
  fee_rule_name: string;
  fee_rule_key: string;
  fee_bill_type: string;
  institution_key: string;
  school_key: string;
  student_key: string;
  student_name: string;
  admission_number: string;
  current_class: string;
  generated_date: string;
  bill_date: string;
  pay_by_date: string;
  bill_amount: number;
  fine_amount: number;
  total_amount: number;
  status: string;
  audit_logs: AuditLog[] = [];
  fee_items: FeeItem[] = [];
}

export class AuditLog{
  date: string;
  message: string;
}

export class FeeItem{
  amount: number = 0;
  code: string;
  name: string;
}
