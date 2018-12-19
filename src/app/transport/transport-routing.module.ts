import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TransportComponent } from './transport.component';
import { RoutesComponent } from './routes/routes.component';
import { TripComponent } from './trip/trip.component';
import { VehicleComponent } from './vehicle/vehicle.component';

import { SubscriptionComponent } from './subscription/subscription.component';

const transportRoutes: Routes = [
    {
        path: 'transport',
        component: TransportComponent,
        children: [
            { path: '', component: TripComponent },
            { path: 'routes', component: RoutesComponent },
            { path: 'trips', component: TripComponent },
            { path: 'vehicle', component: VehicleComponent },
            { path: 'subscription', component: SubscriptionComponent },
            { path: 'subscription/:student_key', component: SubscriptionComponent }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(transportRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class TransportRoutingModule { }
