export class Subscription {
  subscription_key: string;
  subscriber_key: string;
  service_key: string;
  institution_key: string;
  subscriber_type: string;
  subscription_periods: SubscriptionPeriod[];
  type: string;
  trip: SubscribedTrip;
  audit_logs: SubscriptionAuditLog[];
}

export class SubscribedTrip{
  route_key: string;
  trip_key: string;
  stop_code: string;
}

export class SubscriptionAuditLog{
  date: string;
  user: string;
  message: string;
}

export class SubscriptionPeriod{
  from_date: string;
  to_date: string;
}
