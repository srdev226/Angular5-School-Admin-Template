export class Route {

  route_key: string;
  name: string;
  stops: Stop[];
  fare_periods: FarePeriod[];

}

export class Stop {
  index: number;
  code: string;
  name: string;
  distance: number;
  fare_amounts: FareAmount[];
  attr: String;
  lat: number;
  lng: number;
}

export class FareAmount {
  amount: number;
  period_code: string;
}

export class FarePeriod {
  start_date: string;
  end_date: string;
  code: string;
}
