export class Trip {
  trip_key: string;
  route_key: string;
  vehicle_key: string;
  name: string;
  stops: Stop[];
}

export class Stop{
  stop_code: string;
  name: string;
  eta: string;
  eta_tz: string;
}
