import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GCCommonModule } from './common/gccommon.module';
import { UserModule} from './user/user.module';
import { CommunicationModule } from './communication/communication.module';
import { LoginComponent } from './login/login.component';
import { ApplicationListComponent } from './application-list/application-list.component';
import { SummaryBoxComponent } from './application-list/summary-box/summary-box.component';
import { ApplicationDetailsComponent } from './application-list/application-details/application-details.component';
import { PersonComponent } from './person/person.component';
import { SchoolComponent } from './management/school/school.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { SearchApplication } from './application-list/application-list.component';
import { SchoolDataService } from './management/school/school-data.service';
import { LoginService } from './login/login.service';
import { LoginHttpClient } from './login/login-http-client';
import { AdmissionService } from './application-list/admission.service';
import { SchoolService } from './management/school/school.service';
import { PersonService } from './person/person.service';
import { FeeRuleService } from './management/fee-rule/fee-rule.service';
import { FeeBillService } from './fee/fee-bill/fee-bill.service';
import { ContactDetailsComponent } from './application-list/application-details/contact-details/contact-details.component';
import { FeeComponent } from './fee/fee.component';
import { FeeBillComponent } from './fee/fee-bill/fee-bill.component';
import { FeeRuleComponent } from './management/fee-rule/fee-rule.component';
import { FeeRoutingModule } from './fee/fee-routing.module';
import { ManagementComponent } from './management/management.component';
import { InstitutionComponent } from './management/institution/institution.component';
import { SchoolManagementComponent } from './management/school-management/school-management.component';
import { ManagementRoutingModule } from './management/management-routing.module';
import { CalenderRoutingModule } from './calender/calender-routing.module';
import { SchoolManagementService } from './management/school-management/school-management.service';
import { InstitutionInfoComponent } from './management/institution/institution-info/institution-info.component';
import { InstitutionService } from './management/institution/institution.service';
import { UserAccountHttpClient} from './user-account/user-account-http-client';
import { UserAccountService } from './user-account/user-account.service';
import { UserAccountDataService } from './user-account/user-account-data.service';
import { FeeRuleListComponent } from './management/fee-rule/fee-rule-list/fee-rule-list.component';
import { FeeRuleInfoComponent, TotalFeePipe } from './management/fee-rule/fee-rule-info/fee-rule-info.component';
import { FeeBillListComponent, BillsFilterPipe } from './fee/fee-bill/fee-bill-list/fee-bill-list.component';
import { FeeBillHttpClient } from './fee/fee-bill/fee-bill-http-client';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardService } from './dashboard/dashboard.service';
import { D3Service } from 'd3-ng2-service';
import { MomentModule } from 'angular2-moment';
import { FeeReportComponent } from './fee/fee-report/fee-report.component';
import { FeeReportPipe } from './fee/fee-report/fee-report.pipe';
import { FeeRegisterComponent } from './fee/fee-report/fee-register/fee-register.component';
import { CollectionReportComponent } from './fee/fee-report/collection-report/collection-report.component';
import { NotificationComponent } from './notification/notification.component';
import { NotificationService } from './notification/notification.service';
import { MessagingComponent } from './messaging/messaging.component';
import { MessagingService } from './messaging/messaging.service';
import { MessagingHttpClient } from './messaging/messaging-http-client';
import { AppHttpClient } from './security/app-http-client';
import { TransportComponent } from './transport/transport.component';
import { RoutesComponent } from './transport/routes/routes.component';
import { TransportRoutingModule } from './transport/transport-routing.module';
import { PaymentComponent } from './payment/payment.component';
import { PaymentSummaryComponent } from './payment/payment-summary/payment-summary.component';
import { PaymentService } from './payment/payment.service';
import { ProductService } from './product/product.service';
import { ProductDataService } from './product/product-data.service';
import { TripComponent } from './transport/trip/trip.component';
import { RouteService } from './transport/routes/route.service';
import { TripService } from './transport/trip/trip.service';
import { TripHttpClient } from './transport/trip/trip-http-client';
import { SubscriptionComponent } from './transport/subscription/subscription.component';
import { SubscriptionService } from './transport/subscription/subscription.service';
import { SubscriptionHttpClient } from './transport/subscription/subscription-http-client';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { VehicleComponent } from './transport/vehicle/vehicle.component';
import { VehicleService } from './transport/vehicle/vehicle.service';
import { VehicleHttpClient } from './transport/vehicle/vehicle-http-client';
import { AccessControlModule } from './security/access-control/access-control.module';
import { AgmCoreModule } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { TripLogsComponent } from './transport/trip/trip-logs/trip-logs.component';
import { TripLogsService } from './transport/trip/trip-logs/trip-logs.service';
import { TripLogHttpClient } from './transport/trip/trip-logs/trip-log-http-client';
import { TravelersComponent } from './transport/trip/travelers/travelers.component';
import { AcademicsModule } from './academics/academics.module';
import { NguiMapModule} from '@ngui/map';
import { FeeReceiptComponent } from './fee/fee-bill/fee-receipt/fee-receipt.component';
import { FeeReceiptService } from './fee/fee-bill/fee-receipt/fee-receipt.service';
import { FeeReceiptHttpClient } from './fee/fee-bill/fee-receipt/fee-receipt-http-client';
import { DailyCollectionPipe } from './fee/fee-report/daily-collection.pipe';
import { FeeReceiptListComponent } from './fee/fee-bill/fee-receipt/fee-receipt-list/fee-receipt-list.component';
import { EmployeesModule } from './employees/employees.module';
import { FeeReportHttpClient } from './fee/fee-report/fee-report-http-client';
import { FeeReportService } from './fee/fee-report/fee-report.service';
import { StudentModule } from './student/student.module';
import { ModalComponent } from './_directives/index';
import { ModalService } from './_services/index';
import { ManageSubjectsComponent } from './management/manage-subjects/manage-subjects.component';
import { CurriculumComponent } from './management/curriculum/curriculum.component';
import { SubjectPlanComponent } from './management/curriculum/subject-plan/subject-plan.component';
import { CurriculumTeacherComponent } from './management/curriculum/curriculum-teacher/curriculum-teacher.component';
import { EditSessionPlanComponent } from './management/curriculum/subject-plan/edit-session-plan/edit-session-plan.component';

//Import toast module
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';

// import { DoughnutChartComponent, PieChartComponent, BarChartComponent } from 'angular-d3-charts';
import { ChartModule ,HIGHCHARTS_MODULES} from 'angular-highcharts';
import * as highstock from 'highcharts/modules/stock.src';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';


import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CalenderComponent } from './calender/calender.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ApplicationListComponent,
    ApplicationDetailsComponent,
    SummaryBoxComponent,
    PersonComponent,
    SchoolComponent,
    UserAccountComponent,
    ContactDetailsComponent,
    SearchApplication,
    FeeComponent,
    FeeBillComponent,
    FeeRuleComponent,
    ManagementComponent,
    InstitutionComponent,
    SchoolManagementComponent,
    ManageSubjectsComponent,
    InstitutionInfoComponent,
    FeeRuleListComponent,
    FeeRuleInfoComponent,
    FeeBillListComponent,
    TotalFeePipe,
    BillsFilterPipe,
    DashboardComponent,
    FeeReportComponent,
    FeeReportPipe,
    FeeRegisterComponent,
    CollectionReportComponent,
    NotificationComponent,
    MessagingComponent,
    TransportComponent,
    RoutesComponent,
    PaymentComponent,
    PaymentSummaryComponent,
    TripComponent,
    SubscriptionComponent,
    VehicleComponent,
    TripLogsComponent,
    FeeReceiptComponent,
    DailyCollectionPipe,
    FeeReceiptListComponent,
    TravelersComponent,
    ModalComponent,
    // DoughnutChartComponent,
    // PieChartComponent,
    // BarChartComponent,
    CurriculumComponent,
    SubjectPlanComponent,
    CurriculumTeacherComponent,
    EditSessionPlanComponent,
    CalenderComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBygnY59_ynRQA6tlzkF0IWJzjVHJ1mI20",
      libraries: ["places"]
    }),
    MomentModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    FeeRoutingModule,
    ManagementRoutingModule,
    CalenderRoutingModule,
    AppRoutingModule,
    NgxChartsModule,
    AccessControlModule,
    GCCommonModule,
    TransportRoutingModule,
    SimpleNotificationsModule.forRoot(),
    AcademicsModule,
    EmployeesModule,
    CommunicationModule,
    StudentModule,
    UserModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyBygnY59_ynRQA6tlzkF0IWJzjVHJ1mI20'}),
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    NgbModule.forRoot(),
    NgbDatepickerModule.forRoot(),
    DlDateTimePickerDateModule,
    ChartModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
  ],
  exports: [BsDropdownModule, TooltipModule, ModalModule],
  providers: [LoginService, LoginHttpClient, SchoolDataService, AdmissionService, PersonService, SchoolService, PaymentService,
     InstitutionService, FeeRuleService, FeeBillService, SchoolManagementService,
    DashboardService, D3Service, UserAccountService, UserAccountDataService, NotificationService, MessagingService, MessagingHttpClient, AppHttpClient,
    ProductService, ProductDataService, RouteService, TripService, TripHttpClient, VehicleService, VehicleHttpClient, SubscriptionService,
    SubscriptionHttpClient, TripLogsService, TripLogHttpClient, FeeReceiptService, FeeReceiptHttpClient, FeeBillHttpClient, UserAccountHttpClient,
    GoogleMapsAPIWrapper, FeeReportHttpClient, FeeReportService, ModalService, { provide: HIGHCHARTS_MODULES, useFactory: () => [ highstock , more , exporting ]}],
  bootstrap: [AppComponent]

})
export class AppModule { }
