export class FeeRule {

  fee_rule_key: string;
  academic_year: string;
  school_key: string;
  fee_rule_type: string;
  institution_key: string;
  student_type: string;
  name: string;
  description: string;
  currency: string;
  payment_frequency: string;
  effective_from_date: string;
  effective_until_date: string;
  fee_periods: FeePeriod[] = [];
  status: string;
  bill_day_of_month: number;
  payment_due_day_of_month: number;
  cocurricular_class_key: string;
  fine_rules: FineRule[] = [];
  audit_logs: AuditLog[] = [];
  class_rules: ClassRule[] = [];
  transport_configuration: TransportConfiguration;
}

export class TransportConfiguration {
  fee_item: FeeItem;
}

export class FeeItem{
  code: string;
  name: string;
}


export class FineRule{

  index: string;
  days: number;
  amount: number;

}

export class FeePeriod{
  start_date: string;
  end_date: string;
  code: string;
}

export class FeeAmount{
  period_code: string;
  amount: number;
}

export class FeeInfo{
  name: string;
  code: string;
  fee_amounts: FeeAmount[] = [];
}

export class ClassRule{
  applied_class: string;
  applied_class_key: string;
  fee_list: FeeInfo[] = [];
}

export class AuditLog{

  date: string;
  message: string;
}
