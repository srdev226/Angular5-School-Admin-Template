import { Component, OnInit } from '@angular/core';

import { Student } from '../../student/student';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StudentService } from '../../student/student.service';
import { SchoolDataService } from '../../management/school/school-data.service';
import { School, Transport, AcademicYear } from '../../management/school/school';
import { TripService } from '../trip/trip.service';
import { Trip } from '../trip/trip';
import * as moment from 'moment';
import { RouteService } from '../routes/route.service';
import { Route, FarePeriod } from '../routes/route';
import { Subscription, SubscribedTrip, SubscriptionPeriod } from './subscription';
import { SubscriptionService } from './subscription.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  loaded: boolean;

  student: Student;
  search_string: string;
  selected_trip_index: number;
  isTripSelected: boolean;
  trips: Trip[];
  filtered_trips: Trip[];
  trip: Trip;
  routes: Route[];
  selected_route: Route;
  isSubFlag: boolean = true;
  todays_date: string;

  subscriptions: Subscription[];
  selected_subscription: Subscription;
  isSearchFocused: boolean;
  public options = {
    position: ["bottom", "right"],
    timeOut: 5000,
    lastOnBottom: true
  };

  constructor(private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private schoolDataService: SchoolDataService,
    private tripService: TripService,
    private routeService: RouteService,
    private subscriptionService: SubscriptionService,
    private _service: NotificationsService) { }

  ngOnInit() {
    this.todays_date = moment().format('DD/MM/YYYY');
    this.selected_trip_index = -1;
    this.isSearchFocused = false;
    this.isTripSelected = false;
    let results = [];
    let student_key = this.route.snapshot.params['student_key'];
    if (student_key) {
      this.isTripSelected = true;
      this.studentService.getStudent(student_key).then(resp => {
        this.student = resp;
        results.push(this.loadSubscriptions());
      })
    } else {
      this.router.navigate(['/transport/trips']);
    }
    let transport = this.schoolDataService.getSchool().transport
    if (transport) {
      results.push(this.loadRoutesAndTrips(transport));
    }
    Promise.all(results).then(x => {
      this.loaded = true;
    })
  }

  isactive(e) {
  if (e.target.checked) {
    this.isSubFlag = false;
    this.subscriptions =[];
    this.loadSubscriptions()
   }
   else {
     this.filterSubscription()
    }
  }

  public filterSubscription(){
    this.subscriptions = this.subscriptions.filter(x =>x.subscription_periods.find(x => x.from_date.split("/")[1] === this.todays_date.split("/")[1] &&
      x.from_date.split("/")[2] === this.todays_date.split("/")[2]));
     if(this.subscriptions.length < 0){
       this.subscriptions =[]
     }
  }

  public searchFocuesed() {
    this.isSearchFocused = true;
  }

  public searchFocuesedOut() {
    this.isSearchFocused = false;
  }

  private loadSubscriptions() {
    let results = [];
    if (!this.subscriptions) {
      this.subscriptions = [];
    }
    if (!this.student.transport_subscriptions)
      return;
    for (let sub_key of this.student.transport_subscriptions) {
      let result = this.subscriptionService.getSubscription(sub_key).then(resp => {
        this.subscriptions.push(resp);
        if(this.isSubFlag && this.subscriptions && this.subscriptions.length > 0){
         this.filterSubscription()
         }
        this.selected_trip_index = this.trips.findIndex(x => {
          return (x.route_key == resp.trip.route_key);
        });
        this.trip = this.trips[this.selected_trip_index];
        // this.selected_route = this.routes.find(x => (x.route_key === this.trip.route_key));
      })
      results.push(result);
    }
    return results;
  }

  public selectTrip(i) {
    this.isTripSelected = false;
    this.trip = this.filtered_trips[i];
    this.selected_trip_index = i;
    this.selected_route = this.routes.find(x => (x.route_key === this.trip.route_key));
  }

  public getTrip(subscription) {
    return this.trips.find(x => (x.trip_key === subscription.trip.trip_key));
  }

  public getStop(subscription) {
    return this.getTrip(subscription).stops.find(x => (x.stop_code === subscription.trip.stop_code));
  }

  public getRoute(subscription) {
    return this.routes.find(x => (x.route_key === subscription.trip.route_key));
  }

  public selectTripAndStop(stop_code) {
    this.isTripSelected = true;
    if (!this.subscriptions) {
      this.subscriptions = [];
    }
    let subscription = new Subscription();
    subscription.type = "TRIP";
    let _trip = new SubscribedTrip();
    _trip.route_key = this.selected_route.route_key;
    _trip.trip_key = this.trip.trip_key;
    _trip.stop_code = stop_code;
    subscription.trip = _trip;
    this.subscriptions.push(subscription);
    this.selected_subscription = subscription;
  }

  public addOrRemoveSubscriptionPeriod(subscription, fare_period) {
    if (this.isFarePeriodSelected(subscription, fare_period)) {
      let index = subscription.subscription_periods.findIndex(x => (x.from_date === fare_period.start_date));
      subscription.subscription_periods.splice(index, 1);
    } else {
      let subscr_period = new SubscriptionPeriod();
      subscr_period.from_date = fare_period.start_date;
      subscr_period.to_date = fare_period.end_date;
      if (!subscription.subscription_periods) {
        subscription.subscription_periods = [];
      }
      subscription.subscription_periods.push(subscr_period);
    }
  }

  public selectOrUnselectAllSubscriptionPeriods(subscription, e) {
    if (e.target.checked) {
      let fare_periods = this.getRoute(subscription).fare_periods;
      if (!this.selected_subscription.subscription_periods) {
        this.selected_subscription.subscription_periods = [];
      }
      for (let fare_period of fare_periods) {
        this.selected_subscription.subscription_periods.push(this.getNewSubscriptionPeriod(fare_period));
      }
    } else {
      this.selected_subscription.subscription_periods = [];
    }
  }

  private getNewSubscriptionPeriod(fare_period: FarePeriod) {
    let subscr_period = new SubscriptionPeriod();
    subscr_period.from_date = fare_period.start_date;
    subscr_period.to_date = fare_period.end_date;
    return subscr_period;
  }

  public isFarePeriodSelected(subscription, fare_period) {
    if (subscription.subscription_periods && subscription.subscription_periods.find(x => x.from_date === fare_period.start_date)) {
      return true;
    } else {
      return false;
    }
  }

  private loadRoutesAndTrips(transport) {
    let results = [];
    this.routes = [];
    for (let route_key of transport.routes) {
      let result = this.routeService.getRoute(route_key).then(resp => {
        this.routes.push(resp);
      });
      results.push(result);
    }
    this.trips = [];
    for (let trip_key of transport.trips) {
      let result = this.tripService.getTrip(trip_key).then(resp => {
        this.trips.push(resp);
      });
      results.push(result);
    }
    this.filtered_trips = this.trips;
    return results;
  }

  public updateTrips() {
    console.log(this.search_string);
    this.filtered_trips = this.trips.filter((item) => {
      return item.stops.filter((stopObj) => {
        return stopObj.name.toLowerCase().indexOf(this.search_string.toLowerCase()) >= 0;
      }).length > 0;
    });
    console.log(this.filtered_trips);
  }

  public selectSubscription(subscription) {
    this.selected_subscription = subscription;
    this.trip = this.getTrip(subscription);
  }

  // public unSelectSubscription() {
  //   this.selected_subscription = new Subscription();
  // }

  public addOrUpdateSubscription() {
    if (this.selected_subscription.subscription_key) {
      this.updateSubscription();
    } else {
      this.addSubscription();
    }
  }

  private updateSubscription() {
    // 2 lines below added to update existing records that do not have these. Otherwise redundent
    this.selected_subscription.service_key = this.trip.trip_key;
    this.selected_subscription.subscriber_key = this.student.student_key;

    this.subscriptionService.updateSubscription(this.selected_subscription).then(resp => {
    this.showNotification("Success","Subscription Updated");
  }).catch(resp => {
    this.showErrorNotification("Error","Subscription could not be updated");
  })
  this.isTripSelected = false;
}

  private addSubscription() {
    this.selected_subscription.subscriber_key = this.student.student_key;
    this.selected_subscription.subscriber_type = "STUDENT";
    this.selected_subscription.service_key = this.trip.trip_key;
    this.selected_subscription.institution_key = this.schoolDataService.getSchool().school_id;
    this.subscriptionService.addSubscription(this.selected_subscription).then(resp => {
      this.showNotification('Success', 'Subscription added !');
      this.selected_subscription.subscription_key = resp.subscription_key;
      if (!this.student.transport_subscriptions) {
        this.student.transport_subscriptions = [];
      }
      this.student.transport_subscriptions.push(resp.subscription_key);
      this.studentService.updateStudent(this.student).then(student_resp => {
      })
    }).catch(resp => {
      this.showErrorNotification("Error","Subscription could not be added");
    })
  }
  private showNotification(msg_type, message){
    const toast = this._service.success(msg_type, message, {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

  private showErrorNotification(msg_type, message){
    const toast = this._service.error(msg_type, message, {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

}
