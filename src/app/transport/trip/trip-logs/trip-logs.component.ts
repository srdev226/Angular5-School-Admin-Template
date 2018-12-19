import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TripLogsService } from './trip-logs.service';
import { Trip, Stop as TripStop } from './../trip';
import { Route } from '../../routes/route';
import { RouteService } from '../../routes/route.service';
import { TripService } from '../trip.service';
import { TripLog } from './../trip-logs/trip-log';
import { Vehicle } from '../../vehicle/vehicle';
import { VehicleService } from '../../vehicle/vehicle.service';
import { } from 'googlemaps';
import * as moment from 'moment';
import { DirectionsRenderer } from '@ngui/map';

@Component({
  selector: 'app-trip-logs',
  templateUrl: './trip-logs.component.html',
  styleUrls: ['./trip-logs.component.css']
})
export class TripLogsComponent implements OnInit {

  _trip: Trip;
  center:Number[] = [0,0];
  trip_log: TripLog;
  trip_logs: TripLog[];

  showMap: boolean = false;
  showTrackList: boolean = false;
  directionsService: any;
  isLiveTrip: boolean = false;
  showLiveTrip: boolean = false;
  trips: Trip[];
  path: any;
  selected_trip_index: number;
  routes: Route[];
  selected_route: Route;
  selected_vehicle: Vehicle;
  vehicles: Vehicle[];
  vehicle: Vehicle;
  options: any;
  options1: any;
  isEdit = false;
  firstLat: number;
  firstLng: number;
  latlngBounds: any;
  zoom: any;
  liveTrackInterval: any;
  locations: any;
  wrapperObj: any;
  showInfo: boolean = false;
  temp_trip_logs: any = [];
  public notification_options = {
    position: ["bottom", "right"],
    timeOut: 5000,
    lastOnBottom: true
  };
  @ViewChild(DirectionsRenderer) directionsRendererDirective: DirectionsRenderer;

  constructor(private tripLogsService: TripLogsService) { }

  ngOnInit() {
    this.firstLng = 77.56577800000002;
    this.firstLat = 13.0087675;
    console.log('[TripLogsComponent] trip ', this.trip.trip_key);
    this.options1 = [
      {
        "featureType": "administrative.country",
        "elementType": "geometry",
        "stylers": [
          {
            "visibility": "simplified"
          },
          {
            "hue": "#ff0000"
          }
        ]
      }
    ];
  }

  private hideLiveTripTracking() {
    if (this.liveTrackInterval) {
      clearInterval(this.liveTrackInterval);
      this.liveTrackInterval = null;
    }
    this.showMap = false;
    this.firstLng = 77.56577800000002;
    this.firstLat = 13.0087675;
  }

  private bounds: google.maps.LatLngBounds;
  private map: google.maps.Map;

  onMapReady(map) {
    this.map = map;
    this.bounds = new google.maps.LatLngBounds();
  }

  onMarkerInit(marker) {
    this.bounds.extend(marker.getPosition());
    this.map.fitBounds(this.bounds);
    this.map.setCenter(this.bounds.getCenter());
  }

  private setTripLogs() {
    if(! this.trip || !this.trip.trip_key){
      return;
    }
    this.tripLogsService.getLatestTripLog(this.trip.trip_key).then(resp => {
      this.trip_log = resp;
      console.log('[TripLogsComponent] trip_log', resp);
    }).catch(resp => {
      console.error("[TripLogsComponent] Latest Trip logs could not be loaded for", this.trip.trip_key);
      this.trip_log = undefined;
    })
    this.tripLogsService.getTripLogs(this.trip.trip_key).then(resp => {
      this.trip_logs = resp;
    }).catch(resp => {
      console.error("[TripLogsComponent] Trip logs could not be loaded for", this.trip.trip_key);
      this.trip_logs = undefined;
    })
  }

  public showTripDetailsOnMap(trip_log_key){
    this.tripLogsService.getTripLog(trip_log_key).then(resp => {
      let trip_log = resp;
      this.showTripOnMap(trip_log);
    })
  }

  private showTripOnMap(trip_log) {
    console.log('[TripLogsComponent] trip_log ', trip_log)
    if(! trip_log || !trip_log.logs || trip_log.logs.length < 1){
      console.warn('[TripLogsComponent] Logs date not present. Can not map');
      return;
    }
    this.center = [trip_log.logs[0].lat,trip_log.logs[0].lng];
    this.showMap = true;
    let current = moment();
    let starttime = moment(this.trip.stops[0].eta);
    let endtime = moment(this.trip.stops[this.trip.stops.length - 1].eta);
    if (current.isBetween(starttime, endtime)) {
      this.showLiveTrip = true;
      this.liveTrackInterval = setInterval(() => {
        this.updatePaths();
      }, 5000);
    } else {
      this.showLiveTrip = false;
    }
    //comment this line to remove hardcoded live trip tracking
    this.showLiveTrip = true;
    this.path = [];
    for (let i = 0; i < trip_log.logs.length; i++) {
      if (i == 0 || i == trip_log.logs.length - 1) {
        continue;
      }
      this.path.push({ lat: Number(trip_log.logs[i].lat), lng: Number(trip_log.logs[i].lng) })
    }
  }

  public showLiveTripTracking() {
    this.center = [this.trip_log.logs[0].lat,this.trip_log.logs[0].lng];
    this.showMap = true;
    let current = moment();
    let starttime = moment(this.trip.stops[0].eta);
    let endtime = moment(this.trip.stops[this.trip.stops.length - 1].eta);
    if (current.isBetween(starttime, endtime)) {
      this.showLiveTrip = true;
      this.liveTrackInterval = setInterval(() => {
        this.updatePaths();
      }, 5000);
    } else {
      this.showLiveTrip = false;
    }
    //comment this line to remove hardcoded live trip tracking
    this.showLiveTrip = true;
    this.path = [];
    for (let i = 0; i < this.trip_log.logs.length; i++) {
      if (i == 0 || i == this.trip_log.logs.length - 1) {
        continue;
      }
      this.path.push({ lat: Number(this.trip_log.logs[i].lat), lng: Number(this.trip_log.logs[i].lng) })
    }
  }

  updatePaths = function () {
    let current = moment();
    let starttime = moment(this.trip.stops[0].eta);
    let endtime = moment(this.trip.stops[this.trip.stops.length - 1].eta);
    this.tripService.getLatestTripLog(this.trip.trip_key).then(resp => {
      this.trip_log = resp;
      if (!current.isBetween(starttime, endtime)) {
        this.showLiveTrip = false;
        if (this.liveTrackInterval)
          clearInterval(this.liveTrackInterval);
        return;
      }
      this.path = [];
      for (let i = 0; i < this.trip_log.logs.length; i++) {
        if (i == 0 || i == this.trip_log.logs.length - 1) {
          continue;
        }
        this.path.push({ lat: Number(this.trip_log.logs[i].lat), lng: Number(this.trip_log.logs[i].lng) })
      }
    }).catch(resp => {
      console.error("Latest Trip logs could not be loaded for", this.trip.trip_key);
    })
  }

  @Input()
  set trip(trip: Trip) {
    this._trip = trip;
    this.setTripLogs();
  }

  get trip(): Trip {
    return this._trip;
  }

}
