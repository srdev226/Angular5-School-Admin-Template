import { Component, OnInit, NgZone, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Route, Stop, FarePeriod, FareAmount } from './route';
import { Trip, Stop as TripStop } from '../trip/trip';
import { TripService } from '../trip/trip.service';
import { RouteService } from './route.service';
import { SchoolDataService } from '../../management/school/school-data.service';
import { SchoolService } from '../../management/school/school.service';
import { School, Transport, AcademicYear } from '../../management/school/school';
import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
import { NotificationsService } from 'angular2-notifications';
import { } from 'googlemaps';
import * as moment from 'moment';
import { local } from 'd3';
import { setInterval } from 'timers';

enum PageStateType { STOPS, FARE }

export class PageState {
  constructor(public type: PageStateType) { }
}

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit {

  public notification_options = {
    position: ["bottom", "right"],
    timeOut: 5000,
    lastOnBottom: true
  };

  constructor(private routeService: RouteService,
    private tripService: TripService,
    private schoolDataService: SchoolDataService,
    private _service: NotificationsService,
    private schoolService: SchoolService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private _wrapper: GoogleMapsAPIWrapper) {
  }

  @ViewChildren("search")
  public searchElementRef: QueryList<ElementRef>;

  gettingLocation: boolean = false;
  private NO_OF_STOPS: number = 6;
  pageStateType = PageStateType;
  pageState: PageState;
  flightPlanCoordinates: any[];
  routes: Route[];
  route: Route;
  trips: Trip[];
  transport: Transport;

  route_schema: any;
  trip_schema: any;
  stop_schema: any;
  selected_route: number;
  arrival_schema: any;
  academic_year: AcademicYear;
  fare_payment_frequency: string = 'MONTHLY';
  academic_years: AcademicYear[];
  selected_year: string;


  isEdit: boolean = false;
  public latitude: number;
  public longitude: number;
  public zoom: number = 12;
  latlngBounds: any;
  options: any;
  options1: any;
  firstLat: number;
  firstLng: number;
  markerMoveInterval: any;

  ngOnInit() {

    this.academic_years = this.schoolDataService.getSchool().academic_years;
    // new google.maps.Geocoder
    this.options =
      [
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e9e9e9"
            },
            {
              "lightness": 17
            }
          ]
        },
        {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f5f5"
            },
            {
              "lightness": 20
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#ffffff"
            },
            {
              "lightness": 17
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#ffffff"
            },
            {
              "lightness": 29
            },
            {
              "weight": 0.2
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ffffff"
            },
            {
              "lightness": 18
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ffffff"
            },
            {
              "lightness": 16
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f5f5"
            },
            {
              "lightness": 21
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dedede"
            },
            {
              "lightness": 21
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "visibility": "on"
            },
            {
              "color": "#ffffff"
            },
            {
              "lightness": 16
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "saturation": 36
            },
            {
              "color": "#333333"
            },
            {
              "lightness": 40
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f2f2f2"
            },
            {
              "lightness": 19
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#fefefe"
            },
            {
              "lightness": 20
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#fefefe"
            },
            {
              "lightness": 17
            },
            {
              "weight": 1.2
            }
          ]
        }
      ]
      ;
    this.options1 = [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#212121"
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#212121"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#181818"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#1b1b1b"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#2c2c2c"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#8a8a8a"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#373737"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#3c3c3c"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#4e4e4e"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#3d3d3d"
          }
        ]
      }
    ];
    this.selected_route = 0;
    this.routes = [];
    this.pageState = new PageState(PageStateType.STOPS);
    if (this.schoolDataService.getSchool().transport) {
      this.transport = this.schoolDataService.getSchool().transport;
      this.loadRoutes(this.transport);
      this.loadTrips(this.transport);
    }
    if (this.schoolDataService.getSchool().academic_years) {
      this.academic_year = this.schoolDataService.getSchool().academic_years[0];
    }

    this.mapsAPILoader.load().then(() => {

      this.flightPlanCoordinates = [
        { lat: 37.772, lng: -122.214 },
        { lat: 21.291, lng: -157.821 },
        { lat: -18.142, lng: 178.431 },
        { lat: -27.467, lng: 153.027 }
      ];

      this.zoom = 4;
      this.latitude = 39.8282;
      this.longitude = -98.5795;
    });
  }

  private loadRoutes(transport) {
    for (let route_key of transport.routes) {
      this.routeService.getRoute(route_key).then(resp => {
        resp.stops.forEach((item) => {
          if (item.lat)
            item.lat = Number(item.lat);
        })
        this.routes.push(resp);
        this.route = this.routes[0];
      });
    }
  }

  private loadTrips(transport) {
    let results = [];
    for (let trip_key of transport.trips) {
      let result = this.tripService.getTrip(trip_key).then(resp => {
        if(! this.trips){
          this.trips = [];
        }
        this.trips.push(resp);
      });
      results.push(result);
    }
    return results;
  }

  public initSetFare() {
    this.pageState = new PageState(PageStateType.FARE);
    console.log('[RoutesComponent] this.academic_year ', this.academic_year);
    if (this.academic_year) {
      this.selected_year = this.academic_year.code;
      this.route.fare_periods = this.getFarePeriods(this.academic_year);
      this.resetFareAmounts(this.route.fare_periods);
    } else {
      console.log('[WARN] academic year not setup');
    }
  }

  public setFarePeriods(){
    console.log('[RoutesComponent] setting fare periods for academic year ' + this.selected_year);
    if(this.selected_year){
      this.academic_year = this.academic_years.find( x=> (x.code === this.selected_year));
      let academic_year_fare_periods = this.getFarePeriods(this.academic_year);
      if(academic_year_fare_periods && academic_year_fare_periods.length > 0 &&
         !this.route.fare_periods.find(x => x.code === academic_year_fare_periods[0].code)){
        this.route.fare_periods = this.route.fare_periods.concat(academic_year_fare_periods);
      }
      this.resetFareAmounts(this.route.fare_periods);
    }
  }

  public getFareAmountIndex(stop_code){

  }

  private resetFareAmounts(fare_periods) {
    for (let stop of this.route.stops) {
      for (let fare_period of fare_periods) {
        if(! stop.fare_amounts.find(x => x.period_code === fare_period.code)){
          let fare_amount: FareAmount = new FareAmount();
          fare_amount.period_code = fare_period.code;
          stop.fare_amounts.push(fare_amount);
        }
      }
    }
  }

  private getFarePeriods(acd_year): FarePeriod[] {
    let feePeriods: FarePeriod[] = [];
    let from_date = moment(acd_year.start_date, 'DD/MM/YYYY', true);
    let to_date = moment(acd_year.end_date, 'DD/MM/YYYY', true);
    let period_from_date = from_date;

    while (period_from_date < to_date) {
      let fee_period = new FarePeriod();
      fee_period.start_date = period_from_date.format('DD/MM/YYYY');
      switch (this.fare_payment_frequency) {
        case 'MONTHLY': {
          fee_period.end_date = period_from_date.add(1, 'month').add(-1, 'day').format('DD/MM/YYYY');
          period_from_date.add(1, 'day');
          break;
        }
        case 'QUARTERLY': {
          fee_period.end_date = period_from_date.add(3, 'month').add(-1, 'day').format('DD/MM/YYYY');
          period_from_date.add(1, 'day');
          break;
        }
        case 'ANNUAL': {
          fee_period.end_date = to_date.format('DD/MM/YYYY');
          period_from_date = to_date;
          break;
        }
        default: {
          period_from_date = to_date;
          break;
        }
      }
      fee_period.code = fee_period.start_date + '-' + fee_period.end_date;
      feePeriods.push(fee_period);
    }
    return feePeriods;
  }

  public selectRoute(index) {
    this.isEdit = false;
    this.route = this.routes[index];
    this.selected_route = index;
    this.pageState = new PageState(PageStateType.STOPS);
    this.latlngBounds = new window['google'].maps.LatLngBounds();
    this.route.stops.forEach((location, index) => {
      this.latlngBounds.extend(new window['google'].maps.LatLng(location.lat, location.lng));
      if (index == 0) {
        this.firstLat = location.lat;
        this.firstLng = location.lng;
      };
    });
  }

  addNewRoute() {
    this.route = new Route();
    this.route.stops = [];
    this.addStops(this.NO_OF_STOPS);
    this.routes.push(this.route);
    this.selected_route = this.routes.length - 1;
    this.pageState = new PageState(PageStateType.STOPS);
    this.isEdit = true;
    this.latlngBounds = new window['google'].maps.LatLngBounds();
    this.latlngBounds.extend(new window['google'].maps.LatLng(10.8505, 76.2711));
    setTimeout(() => {
      this.zoom = 8;
      for (let i = 0; i < this.searchElementRef.length; i++) {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.toArray()[i].nativeElement, {
          types: ["address"]
        });
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
            this.route.stops[i].attr = place.formatted_address;
            this.route.stops[i].lat = place.geometry.location.lat();
            this.route.stops[i].lng = place.geometry.location.lng();
          });
        });
        autocomplete.setComponentRestrictions({ 'country': ['in'] });
      };
    }, 1000);
  }

  editRoute() {
    this.isEdit = true;
    // setTimeout(() => {
    //   for (let i = 0; i < this.searchElementRef.length; i++) {
    //     let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.toArray()[i].nativeElement, {
    //       types: ["address"]
    //     });
    //     autocomplete.addListener("place_changed", () => {
    //       this.ngZone.run(() => {
    //         let place: google.maps.places.PlaceResult = autocomplete.getPlace();
    //         this.route.stops[i].attr = place.formatted_address;
    //         this.route.stops[i].lat = place.geometry.location.lat();
    //         this.route.stops[i].lng = place.geometry.location.lng();
    //       });
    //     });
    //     autocomplete.setComponentRestrictions({ 'country': ['in'] });
    //   };
    // }, 500);
  }

  addNewMarker(mapobj) {
    if (this.isEdit) {
      var that = this;
      var latlng: google.maps.GeocoderRequest = { location: new google.maps.LatLng(mapobj.coords.lat, mapobj.coords.lng) };
      var type: google.maps.GeocoderRequest;
      var geocoder = new google.maps.Geocoder();
      this.gettingLocation = true;
      geocoder.geocode(latlng, function (results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
          alert(status);
          that.gettingLocation = false;
        }
        if (status == google.maps.GeocoderStatus.OK) {
          var address = (results[0].formatted_address);
          let stop: any = new Object();
          stop.code = that.genStopCode();
          stop.index = that.route.stops.length + 1;
          stop.fare_amounts = [];
          stop.lat = mapobj.coords.lat;
          stop.lng = mapobj.coords.lng;
          stop.attr = address;
          stop.isOpen = true;
          that.route.stops.push(stop);
          that.gettingLocation = false;
        }
      });
    }
  }

  addStops(count) {
    for (let cnt = 0; cnt < count; cnt++) {
      let stop = new Stop();
      stop.code = this.genStopCode();
      stop.index = this.route.stops.length + 1;
      stop.fare_amounts = [];
      this.route.stops.push(stop);
    }
    setTimeout(() => {
      for (let i = 0; i < this.searchElementRef.length; i++) {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.toArray()[i].nativeElement, {
          types: ["address"]
        });
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
            this.route.stops[i].attr = place.formatted_address;
            this.route.stops[i].lat = place.geometry.location.lat();
            this.route.stops[i].lng = place.geometry.location.lng();
          });
        });
        autocomplete.setComponentRestrictions({ 'country': ['in'] });
      }
    }, 500);
  }

  genStopCode() {
    let code = Math.random().toString(36).slice(2, 9);
    console.log('[RoutesComponent] stop_code', code);
    return code;
  }

  addOrUpdateRoute() {
    this.removeStopsWithoutData(this.route);
    this.normalizeFareAmounts(this.route);
    if (this.route.route_key) {
      this.updateRoute();
    } else {
      this.addRoute();
    }
  }

  removeStopsWithoutData(_route: Route) {
    let _stops = [];
    for (let stop of _route.stops) {
      if (stop.name) {
        _stops.push(stop);
      }
    }
    this.route.stops = _stops;
  }

  // Though backend saves fare amount for each time period, UI does not support that yet. So copying first fare_amount to other periods as we
  private normalizeFareAmounts(_route: Route) {
    for (let stop of _route.stops) {
      for (let fare_amount of stop.fare_amounts) {
        fare_amount.amount = stop.fare_amounts[0].amount;
      }
    }
  }

  private updateRoute() {
    this.routeService.updateRoute(this.route).then(resp => {
      console.log('[RoutesComponent] route updated');
      Promise.all(this.updateTrips(this.route)).then(x => {
        this.showNotification("Success", "Route Updated");
      }).catch(resp => {
        this.showErrorNotification("Error", "Trips could not be updated with route changes");
      });
      this.isEdit = false;
    }).catch(resp => {
      this.showErrorNotification("Error", "Route could not be updated");
    })
  }

  private updateTrips(route){
    let results = []
    if(this.trips){
      let route_trips = this.trips.filter(y => (y.route_key === route.route_key));
      if(route_trips){
        for(let route_trip of route_trips){
          for (let route_stop of route.stops){
            let trip_stop = route_trip.stops.find(x => (x.stop_code === route_stop.code));
            if(trip_stop){
              trip_stop.name = route_stop.name;
            }else{
              trip_stop = new TripStop();
              trip_stop.name = route_stop.name;
              trip_stop.stop_code = route_stop.code;
              if(!route_trip.stops){
                route_trip.stops = [];
              }
              route_trip.stops.push(trip_stop);
            }
          }
          let result = this.tripService.updateTrip(route_trip).then(resp => {
            console.log('Trip ' + route_trip.name + ' updated .....')
          });
          results.push(result);
        }
      }
    }
    return results;
  }


  private addRoute() {
    this.routeService.addRoute(this.route).then(resp => {
      this.route.route_key = resp.route_key;
      console.log('[RoutesComponent] route added');
      let school = this.schoolDataService.getSchool();
      if (!school.transport) {
        school.transport = new Transport();
      }
      if (!school.transport.routes) {
        school.transport.routes = [];
      }
      school.transport.routes.push(this.route.route_key);
      this.schoolService.updateSchool(school).then(resp => {
        console.log('[RoutesComponent] school updated');
        this.showNotification('Success', 'Route added !');
      }).catch(resp => {
        this.showErrorNotification("Error", "Route could not be added");
      })
      this.isEdit = false;
    }).catch(resp => {
      this.showErrorNotification("Error", "Route could not be added");
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


}
