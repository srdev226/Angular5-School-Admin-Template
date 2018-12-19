import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';

import * as moment from 'moment';

import { AdmissionApplication, AuditLog, Note } from '../../application-list/admission-application';
import { Person } from '../../person/person';
import { Student } from '../../student/student';
import { PaymentInfo } from '../../payment/payment-info';

import { SchoolDataService } from '../../management/school/school-data.service';
import { UserAccountDataService } from '../../user-account/user-account-data.service';
import { ProductDataService } from '../../product/product-data.service';

import { StudentService } from '../../student/student.service';
import { StudentDataService } from '../../student/student-data.service';
import { ClassesDataService } from '../../academics/classes/classes-data.service';
import { AdmissionService } from '../../application-list/admission.service';
import { PersonService } from '../../person/person.service';
import { NotificationService } from '../../notification/notification.service';
import { PaymentService } from '../../payment/payment.service';
import { NotificationsService as AngularNotifications } from 'angular2-notifications' ;


@Component({
  selector : 'app-application-details',
  templateUrl : './application-details.component.html',
  styleUrls : [ './application-details.component.css' ]
})

export class ApplicationDetailsComponent implements OnInit,OnChanges {

  @Input() admission_application: AdmissionApplication;
  @Output() applStatusChange = new EventEmitter();

  enrolled_student: Student;
  payment_info: PaymentInfo;

  admission_number: string;
  note_message: string;
  note_flag: boolean = false;
  add_note_flag: boolean = false;
  isUnpaid: boolean = false;
  isEnrolled: boolean = false;
  isPayByCash: boolean = false;

  billNo: string;
  child_profile_image_url : string;
  mother_profile_image_url : string;
  father_profile_image_url : string;
  guardian_profile_image_urls : string[] = [];

  application_status_list = ["Completed", "New", "Review", "Accepted", "Rejected"];
  current_application_status: string;

  public options = {
    position: ["bottom", "right"],
    timeOut: 5000,
    lastOnBottom: true
  };

  constructor(private personService: PersonService,
              private paymentService: PaymentService,
              private admissionService:AdmissionService,
              private schoolDataService: SchoolDataService,
              private studentService: StudentService,
              private studentDataService: StudentDataService,
              private notificationService: NotificationService,
              private userAccountDataService: UserAccountDataService,
              private productDataService: ProductDataService,
              private classesDataService: ClassesDataService,
              private angularNotifications: AngularNotifications
              ) {}

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges){
    this.enrolled_student = undefined;
    this.getApplicantDetails();
    this.resetFlags();
    this.current_application_status = this.admission_application.applicationData.status;
  }

  private resetFlags(){
    this.note_flag = false;
    this.add_note_flag = false;
  }

  getReligionName(code: string){
    let religion = this.productDataService.masterProduct.demographic_configuration.religions.find(x => x.code === code);
    if(religion){
      return religion.name;
    }
  }

  getCasteName(code: string){
    let caste = this.productDataService.masterProduct.demographic_configuration.castes.find(x => x.code === code);
    if(caste){
      return caste.name;
    }
  }

  getProfesssion(code: string){
    let profession = this.productDataService.masterProduct.demographic_configuration.professions.find(x => x.code === code);
    if(profession){
      return profession.name;
    }
  }

  getEducation(code: string){
    return this.productDataService.masterProduct.demographic_configuration.educationLevels.filter(x => x.code === code)[0].desc;
  }

  getApplicantDetails(){
    if(this.admission_application.applicationData.candidate_personal_id){
     this.personService.getPerson(this.admission_application.applicationData.candidate_personal_id).then(resp => {
          this.admission_application.child = resp;
          if(resp.profile_image_key){
            this.studentService.getProfilePicture(resp.profile_image_key).then(file_resp =>
              this.child_profile_image_url = file_resp.url);
          }
        });
      }

    if(this.admission_application.applicationData.payment_status !== 'success'){
      this.isUnpaid = true;
    }else{
      if(this.admission_application.applicationData.father_person_key){
        this.personService.getPerson(this.admission_application.applicationData.father_person_key).then(resp => {
          this.admission_application.father = resp;
          if(resp.profile_image_key){
            this.studentService.getProfilePicture(resp.profile_image_key).then(file_resp =>
              this.father_profile_image_url = file_resp.url);
            }
          });
        }
        if(this.admission_application.applicationData.mother_person_key){
          this.personService.getPerson(this.admission_application.applicationData.mother_person_key).then(resp => {
            this.admission_application.mother = resp;
            if(resp.profile_image_key){
              this.studentService.getProfilePicture(resp.profile_image_key).then(file_resp =>
                this.mother_profile_image_url = file_resp.url);
              }
            });
        }
       this.admission_application.guardians = [];
       this.guardian_profile_image_urls = [];
       if(this.admission_application.applicationData.guardian_person_keys.length > 0){
         for(let guardian of this.admission_application.applicationData.guardian_person_keys){
            this.personService.getPerson(guardian).then(resp=> {
              if(resp.profile_image_key){
                this.studentService.getProfilePicture(resp.profile_image_key).then(file_resp =>{
                  this.guardian_profile_image_urls.push(file_resp.url)});
              }
              this.admission_application.guardians.push(resp);
            });
           }
         }
       }
   }

   toggleNotes(){
     this.note_flag = !this.note_flag;
   }

   toggleAddNote(){
     this.add_note_flag = !this.add_note_flag;
   }

  onStatusChange(){
    let msg = "Changed status to " + this.admission_application.applicationData.status;
    this.updateApplication(this.admission_application.applicationData, msg);
  }

  private updateApplication(application, audit_message){
    this.setAuditLogs(audit_message);
    this.admissionService.updateApplication(this.admission_application.applicationData).then(resp => {
       console.log("[AdmissionComponent] Application status updated ...");
       this.current_application_status = this.admission_application.applicationData.status;
       this.applStatusChange.emit();
       this.showSuccessNotification('Success', 'Status updated');
     }).catch(resp => {
       this.admission_application.applicationData.status = this.current_application_status;
       console.log('[ApplicationDetailsComponent] Error updating application', resp);
       this.showErrorNotification('Error', 'Could not update status');
     });
  }

  private showSuccessNotification(typ, msg){
    const toast = this.angularNotifications.success(typ, msg, {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

  private showErrorNotification(typ, msg){
    const toast = this.angularNotifications.error(typ, msg, {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

  payNow(){
     this.setPaymentInfo();
     this.makePayment();
   }

   private setPaymentInfo(){
     this.payment_info = new PaymentInfo();
     this.payment_info.amount = parseInt(this.schoolDataService.getSchool().admissions.application_fee);
     this.payment_info.product_description = "Application Fee -[" + this.admission_application.applicationData.application_key + "]";
     this.payment_info.payment_type = "cash";
     this.payment_info.bill_no = this.billNo;
     this.payment_info.status = 'success';
   }

   private makePayment() {
     if(!this.admission_application.applicationData.payments){
       this.admission_application.applicationData.payments = [];
     }

     this.paymentService.addPayment(this.payment_info).then( resp => {
       this.admission_application.applicationData.payments.push(resp.payment_key);
       this.admission_application.applicationData.payment_status = 'success';
       let msg = 'Paid by cash with bill no ' + this.billNo;
       this.updateApplication(this.admission_application.applicationData, msg);
     })
   }

  addNote(){
    this.add_note_flag = true;
    let note = new Note();
    note.entry_date = moment().format('LLLL');
    note.user_name = this.userAccountDataService.getPersonDetails().full_name;
    note.message = this.note_message;
    if(!this.admission_application.applicationData.notes){
      this.admission_application.applicationData.notes = [];
    }
    this.admission_application.applicationData.notes.push(note);
    this.admissionService.updateApplication(this.admission_application.applicationData).then(resp => {
       console.log("[AdmissionComponent] Note added ...");
       this.note_message = "";
     });
  }

  private setAuditLogs(msg: string){
    let auditLog = new AuditLog();
    auditLog.log_date = moment().format('LLLL');
    auditLog.user_name = this.userAccountDataService.getPersonDetails().full_name;
    auditLog.message = msg;
    if(!this.admission_application.applicationData.audit_logs){
      this.admission_application.applicationData.audit_logs = [];
    }
    this.admission_application.applicationData.audit_logs.push(auditLog);
  }

  enrollStudent(){
    let student: Student = this.getStudent();
    let class_for_admission = this.getClassInfo(this.admission_application.applicationData.class_applied,
                                            this.admission_application.applicationData.admission_year);
    if(class_for_admission){
      student.current_class_key = class_for_admission.class_info_key;
      this.studentService.addStudent(student).then(resp => {
        if(resp.student_key){
          console.log('[ApplicationDetailsComponent] Student enrolled ', resp.student_key);
          this.admission_application.applicationData.status = "Enrolled";
          this.admission_application.applicationData.student_key = resp.student_key;
          let msg = "Enrolled as student with admission number " + this.admission_number;
          this.setAuditLogs(msg);
          this.admissionService.updateApplication(this.admission_application.applicationData).then(resp => {
             console.log("[AdmissionComponent] Application status updated ...");
             this.applStatusChange.emit();
             this.showSuccessNotification('Success', 'Student enrolled');
             this.isEnrolled = true;
           });
          this.studentService.getStudent(resp.student_key).then(resp => {
            this.enrolled_student = resp;
            this.sendEnrolledNotification();
          })
        }else{
          this.showErrorNotification('Enroll Failed','Admission number may already exist');
        }
      }).catch(resp => {
        this.showErrorNotification('Enroll Failed','Server error');
      });
    }else{
      this.showErrorNotification('Enroll Failed','No suitable class found to enroll student');
    }
  }

  private getClassInfo(cls_code, academic_year){
    return this.classesDataService.getClasses()
                .find(x => x.academic_year === academic_year && x.class_code === cls_code)
  }

  private getStudent(): Student{
    let student: Student = new Student();
    student.full_name = this.admission_application.child.full_name;
    student.gender = this.admission_application.child.gender;
    student.admission_number = this.admission_number;
    student.school_id = this.schoolDataService.getSchool().school_id;
    student.person_key = this.admission_application.child.person_key;
    student.admission_year = this.admission_application.applicationData.admission_year;
    student.current_class = this.admission_application.applicationData.class_applied;
    student.mother_person_key = this.admission_application.mother.person_key;
    student.father_person_key = this.admission_application.father.person_key;
    if(this.admission_application.applicationData.mobile_numbers){
      student.notification_mobile_numbers = this.admission_application.applicationData.mobile_numbers;
    }
    return student;
  }

  private sendEnrolledNotification(){
    if(this.enrolled_student.notification_mobile_numbers){
      let notification_number = this.enrolled_student.notification_mobile_numbers[0];
      let message = this.enrolled_student.full_name + " enrolled to class " + this.enrolled_student.current_class + " in " + this.schoolDataService.getSchool().name;
      let to_identifier = notification_number.country_code + notification_number.phone_number;
      this.notificationService.sendSMSMessage(message, to_identifier).then(resp => {
        console.log('[ApplicationDetailsComponent] SMS sent to parent - message - ', message, ' to_dentifier ', to_identifier);
      })
    }
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print_app_div').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <style>
          table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
}
            .label{
            	font-size: 12px;
            }
            .data {
                font-weight: bold;
                font-size: 12px;
            }
            .head{
            	font-size: 16px;
            }
          .atable  td,th , .btable td,th , .ctable  td,th , .dtable td,th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 5px;
    }
    .atable  tr:nth-child(even), .btable tr:nth-child(even), .ctable tr:nth-child(even) , .dtable tr:nth-child(even) {
    background-color: #dddddd;
}
.aatable td {
  text-align: center;
}

.bbtable td {

    text-align: left;
    }

          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
}
