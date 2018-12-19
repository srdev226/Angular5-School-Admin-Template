import { Component, OnInit } from '@angular/core';
import { Vehicle } from './vehicle';
import { VehicleService } from './vehicle.service';
import { SchoolDataService } from '../../management/school/school-data.service';
import { SchoolService } from '../../management/school/school.service';
import { School, Transport } from '../../management/school/school';
import { NotificationsService } from 'angular2-notifications';


@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

vehicles: Vehicle[];
vehicle: Vehicle;
selected_vehicle_index: number;

isEdit = false;

public notification_options = {
  position: ["bottom", "right"],
  timeOut: 5000,
  lastOnBottom: true
};

constructor(private schoolDataService: SchoolDataService,
  private schoolService: SchoolService,
  private _service: NotificationsService,
  private vehicleService: VehicleService) { }

ngOnInit() {
  let transport = this.schoolDataService.getSchool().transport
  if (transport && transport.vehicles) {
    this.loadVehicles(transport);
  }
}

private loadVehicles(transport) {
  this.vehicles = [];
  for (let vehicle_key of transport.vehicles) {
    this.vehicleService.getVehicle(vehicle_key).then(resp => {
      this.vehicles.push(resp);
      if (this.vehicles.length === 1) {
        this.selectVehicle(0);
      }
    });
  }
}

public addNewVehicle() {
  if (!this.vehicles) {
    this.vehicles = []
  }
  let _vehicle = new Vehicle();
  this.vehicles.push(_vehicle);
  this.selected_vehicle_index = this.vehicles.length - 1;
  this.vehicle = this.vehicles[this.selected_vehicle_index];
  this.isEdit = true;
}

public selectVehicle(i) {
  this.isEdit = false;
  this.vehicle = this.vehicles[i];
  this.selected_vehicle_index = i;
}

public addOrUpdateVehicle() {
  if (this.vehicle.vehicle_key)
  {
    this.updateVehicle();
  }
   else {
    this.addVehicle();
  }
}


private addVehicle() {
  this.vehicleService.addVehicle(this.vehicle).then(resp => {
    this.vehicle.vehicle_key = resp.vehicle_key;
    let school = this.schoolDataService.getSchool();
    if(! school.transport){
      school.transport = new Transport();
    }
    if (!school.transport.vehicles) {
      school.transport.vehicles = [];
    }
    school.transport.vehicles.push(resp.vehicle_key);
    this.schoolService.updateSchool(school).then(school_resp => {
      this.schoolDataService.setSchool(school);
      this.showNotification('Success', 'Vehicle added !');
    }).catch(resp => {
      console.log(resp)
      this.showErrorNotification("Error","Vehicle could not be added");
    })
    this.isEdit = false;
  }).catch(resp => {
      console.log(resp);
      this.showErrorNotification("Error","Vehicle could not be added");
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


private updateVehicle() {
  this.vehicleService.updateVehicle(this.vehicle).then(resp => {
    console.log('[VehicleComponent] vehicle added');
    this.showNotification("Success","Vehicle Updated");
    this.isEdit = false;
  }).catch(resp => {
    this.showErrorNotification("Error","Vehicle could not be updated");
  })
  }
}
