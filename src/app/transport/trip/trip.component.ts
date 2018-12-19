import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { Trip, Stop as TripStop } from './trip';
import { Route } from '../routes/route';
import { RouteService } from '../routes/route.service';
import { TripService } from './trip.service';
import { SchoolDataService } from '../../management/school/school-data.service';
import { SchoolService } from '../../management/school/school.service';
import { School, Transport } from '../../management/school/school';
import { NotificationsService } from 'angular2-notifications';
import { Vehicle } from '../vehicle/vehicle';
import { VehicleService } from '../vehicle/vehicle.service';
import { } from 'googlemaps';
import { TripLog } from './trip-logs/trip-log';
import { TripLogsService } from './trip-logs/trip-logs.service';
import * as moment from 'moment';
import { DirectionsRenderer } from '@ngui/map';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit {

  isLiveTrip: boolean = false;
  showLiveTrip: boolean = false;
  trips: Trip[];
  school: School;
  stopList: any[];
  todays_date: String;
  updatedTrips: Trip[];
  trip: Trip;
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
  trip_log: TripLog;
  locations: any;
  wrapperObj: any;
  showInfo: boolean = false;
  stopInfo: boolean = false;
  temp_trip_logs: any = [];
  public notification_options = {
    position: ["bottom", "right"],
    timeOut: 5000,
    lastOnBottom: true
  };
  @ViewChild(DirectionsRenderer) directionsRendererDirective: DirectionsRenderer;

  constructor(private schoolDataService: SchoolDataService,
    private schoolService: SchoolService,
    private routeService: RouteService,
    private tripService: TripService,
    private tripLogsService: TripLogsService,
    private vehicleService: VehicleService,
    private _service: NotificationsService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.school = this.schoolDataService.getSchool();
    this.todays_date = moment().format('MMM YYYY');
    let transport = this.schoolDataService.getSchool().transport
    if (transport) {
      let routeResults = this.loadRoutes(transport);
      let tripResults = this.loadTrips(transport);
      Promise.all(routeResults.concat(tripResults)).then( resp => {
        console.log('[TripComponent] Routes and trips loaded .....')
      });
      this.loadVehicles(transport)
    }
  }


  public setupEdit(){
    this.isEdit = true;
  }

  private updateTripStopsWithChanges(){
    this.updatedTrips = []
    for(let trip of this.trips){
      let updated_trip = this.getTripCopy(trip);
      let route = this.routes.find(x => (x.route_key === trip.route_key));
      for(let route_stop of route.stops){
        let trip_stop = trip.stops.find( x => (x.stop_code === route_stop.code))
        if(!trip_stop){
          trip_stop = new TripStop();
          trip_stop.stop_code = route_stop.code;
          trip_stop.name = route_stop.name
        }
        updated_trip.stops.push(trip_stop);
      }
    }
  }

  private getTripCopy(trip){
    let new_trip = new Trip();
    new_trip.trip_key = trip.trip_key;
    new_trip.name = trip.name;
    new_trip.route_key = trip.route_key;
    new_trip.vehicle_key = trip.vehicle_key;
    new_trip.stops = [];
    return new_trip;
  }


  private hideInfoTrip() {
    this.showInfo = false;
  }

  private loadRoutes(transport) {
    let results = []
    this.routes = [];
    if(! transport.routes){
      return;
    }
    for (let route_key of transport.routes) {
      let result = this.routeService.getRoute(route_key).then(resp => {
        this.routes.push(resp);
      });
      results.push(result)
    }
    return results
  }

  private loadTrips(transport) {
    let results = []
    this.trips = [];
    if(! transport.trips){
      return;
    }
    for (let trip_key of transport.trips) {
      let result = this.tripService.getTrip(trip_key).then(resp => {
        this.trips.push(resp);
        if (this.trips.length === 1) {
          this.selectTrip(0);
        }
      });
      results.push(result);
    }
    return results;
  }

  private loadVehicles(transport) {
    this.vehicles = [];
    if(!transport.vehicles){
      return;
    }
    for (let vehicle_key of transport.vehicles) {
      this.vehicleService.getVehicle(vehicle_key).then(resp => {
        this.vehicles.push(resp);
      });
    }
  }

  public addNewTrip() {
    if (!this.trips) {
      this.trips = []
    }
    let _trip = new Trip();
    this.trips.push(_trip);
    this.selected_trip_index = this.trips.length - 1;
    this.trip = this.trips[this.selected_trip_index];
    this.selected_route = undefined;
    this.isEdit = true;
    this.showInfo = true;
  }

  public selectTrip(i) {
    this.isEdit = false;
    this.stopList = [];
    this.trip = this.trips[i];
    this.selected_trip_index = i;
    this.selected_route = this.routes.find(x => (x.route_key === this.trip.route_key));
    this.routeService.getRoute(this.trip.route_key).then(resp => {
      let response = resp;
      for(let stop of response.stops){
        let stop_list: any={};
        stop_list.stop = stop.name;
        if(stop.fare_amounts.length > 0){
          stop_list.fare_amount = stop.fare_amounts[0].amount;
        }
        this.stopList.push(stop_list)
      }
    });
    this.selected_vehicle = this.vehicles.find(x => (x.vehicle_key === this.trip.vehicle_key));
    this.tripLogsService.getLatestTripLog(this.trip.trip_key).then(resp => {
      this.trip_log = resp;
      this.isLiveTrip = moment(resp.logs[0]).isSame(new Date(), "day");
    }).catch(resp => {
      console.error("Latest Trip logs could not be loaded for", this.trip.trip_key);
    })

    this.convertTimeToLocal();
  }

  public selectRoute() {
    this.selected_route = this.routes.find(x => (x.route_key === this.trip.route_key));
    this.setTripStops();
  }

  public selectVehicle() {
    this.selected_vehicle = this.vehicles.find(x => (x.vehicle_key === this.trip.vehicle_key));
  }

  public getStopIndex(route_key, stop_code){
    console.log('[TripComponent] getStopIndex() - route_key', route_key, ' stop_code ', stop_code);
    let index;
    if(this.routes){
      let route = this.routes.find(x => x.route_key === route_key);
      if(route){
        let stop = route.stops.find(x => x.code === stop_code);
        if(stop){
          index = stop.index;
        }
      }
      return index;
    }
  }

  private setTripStops() {
    this.trip.stops = [];
    for (let route_stop of this.selected_route.stops) {
      let trip_stop = new TripStop();
      trip_stop.stop_code = route_stop.code;
      trip_stop.name = route_stop.name;
      this.trip.stops.push(trip_stop);
    }
  }

  convertTimeToLocal(){
      for(let stop of this.trip.stops){
        if(stop.eta_tz === "utc"){
          var local = moment(stop.eta).format('D/M/YYYY H:mm');
          var time = local.split(' ')[1];
          var local_time ;
          var hh = time.split(':')[0];
          let mm = time.split(':')[1];
          if(Number(hh) === 0){
            local_time = (Number(hh)+12)+'.'+mm+' AM';
          }
          else if(Number(hh) === 12){
            local_time = Number(hh)+'.'+mm+' PM';
          }
          else if(Number(hh) > 12){
            local_time = (Number(hh)-12)+'.'+mm+' PM';
          }
          else if(Number(hh) < 12){
            local_time = hh+'.'+mm+' AM';
          }
          stop.eta = local_time;
          stop.eta_tz = "local";
        }
      }
    }

  convertTimeToUtc(){

      for(let stop of this.trip.stops){
        if(stop.eta_tz === "local"){
          var time = stop.eta.split(' ')[0];
          var hh = time.split('.')[0];
          let mm = time.split('.')[1];
          if(stop.eta.split(' ')[1] === 'AM' && Number(hh) === 12){
              hh = (Number(hh)-12).toString();
            }
            else if (stop.eta.split(' ')[1] === 'PM' && Number(hh) === 12){
              hh = Number(hh).toString();
            }
            else if (stop.eta.split(' ')[1] === 'PM'){
              hh = (Number(hh)+12).toString();
            }
          var date = moment().format('DD MMM YYYY')+' '+hh+':'+mm;
          var utcDate = moment.utc(moment(date));
          stop.eta = utcDate.toString();
          stop.eta_tz = "utc"
        }
      }
    }

  public addOrUpdateTrip() {
    this.convertTimeToUtc();
    if (this.trip.trip_key) {
      this.updateTrip();
    } else {
      this.addTrip();
    }
  }

  private addTrip() {
    this.tripService.addTrip(this.trip).then(resp => {
      this.trip.trip_key = resp.trip_key;
      let school = this.schoolDataService.getSchool();
      if (!school.transport.trips) {
        school.transport.trips = [];
      }
      school.transport.trips.push(resp.trip_key);
      this.schoolService.updateSchool(school).then(school_resp => {
        this.schoolDataService.setSchool(school);
        this.showNotification('Success', 'Trip added !');
      }).catch(resp => {
        this.showErrorNotification("Error", "Trip could not be added");
      })
      this.isEdit = false;
    }).catch(resp => {
      this.showErrorNotification("Error", "Trip could not be added");
    })
  }

  private showNotification(msg_type, message) {
    const toast = this._service.success(msg_type, message, {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

  private showErrorNotification(msg_type, message) {
    const toast = this._service.error(msg_type, message, {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

  private updateTrip() {
    this.tripService.updateTrip(this.trip).then(resp => {
      this.showNotification("Success", "Trip Updated");
      this.isEdit = false;
    }).catch(resp => {
      this.showErrorNotification("Error", "Trip could not be updated");
    })
  }

  public downloadCsv(csv, student) {
    var csvFile;
    var downloadLink;
    csvFile = new Blob([csv], {type: "text/csv"});
    downloadLink = document.createElement("a");
    downloadLink.download = student;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  public export_table_to_csv(student) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");
    for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll("td, th");
      for (var j = 0; j < cols.length; j++)
      row.push(cols[j].textContent);
      csv.push(row.join(","));
    }
    this.downloadCsv(csv.join("\n"), student);
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print_div').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          table {
               font-family: arial, sans-serif;
               border-collapse: collapse;
               width: 100%;
               font-size: 70%;
          }
          td, th{
              border: 1px solid #424242;
              text-align: left;
              padding: 8px;
          }
          .align{
              text-align: center;
          }
          .table{
            width:100%;
            font-size:12px;
          }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

}
