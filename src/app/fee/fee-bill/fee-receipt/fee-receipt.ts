export class FeeReceipt {
  receipt_key: string;
  receipt_date: string;
  student_key: string;
  serial_number: string;
  fee_bills: string[];
  status: string;
  payments: Payment[];
  discounts: Discount[];
}

export class Discount{
  code: string;
  amount: number;
  note: string;
}


export class Payment{
  mode: string;
  amount: number;
}
