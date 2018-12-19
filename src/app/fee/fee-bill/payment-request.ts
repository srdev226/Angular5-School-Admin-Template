export class PaymentRequest{
  partner_key: string;
  receipt_serial_key: string;
  payments: Payment[];
  fee_bills: string[];
  discounts: Discount[];
}

export class Payment {
  mode: string; //'CASH','CREDIT_CARD','DEBIT_CARD','ONLINE'
  amount: number;
}

export class Discount{
  code: string;
  amount: number;
  note: string;
}
