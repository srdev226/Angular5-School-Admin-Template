export class PaymentInfo {
  partner_key: string;
  first_name: string;
  email: string;
  mobile: string;
  amount: number;
  product_description: string;
  success_url: string;
  failure_url: string;
  cancel_url: string;
  status: string;
  payment_type: string;
  bill_no: string;
}

export class PaymentSummaryData {
	class: string;
	detail: string;
	count: string;
	icon: string;
}
