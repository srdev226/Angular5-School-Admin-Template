export class TripLog {
  trip_log_key: string;
  vehicle_key: string;
  gps_key: string;
  trip_key: string;
  scheduled_date_time: string;
  logs: Log[];
}

export class Log {
  date_time: string;
  lng: number;
  lat: number;
  speed: string;
}
