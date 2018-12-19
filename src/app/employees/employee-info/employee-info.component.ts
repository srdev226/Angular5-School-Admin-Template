  import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NotificationsService as AngularNotifications } from 'angular2-notifications' ;

import { EmployeeInfo } from './employee-info';
import { Employee, Teacher, ClassInfo, Subject } from '../employee';
import { PhoneNumber as Contact } from '../../common/phone-number';
import { PersonInfo, PhoneNumber, Email, Address, IdentityInformation, ImmediateContact, NotificationDetails } from '../../person/person';
import { PersonResponse } from '../../person/person-response';

import { ProductDataService } from '../../product/product-data.service';
import { ClassesDataService } from '../../academics/classes/classes-data.service';
import { SchoolDataService } from '../../management/school/school-data.service';
import { StudentService } from '../../student/student.service';
import { EmployeeService } from '../employee.service';
import { PersonService } from '../../person/person.service';

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.css']
})
export class EmployeeInfoComponent implements OnInit {

  employeeInfo: EmployeeInfo = new EmployeeInfo();
  profile_image_url: string;
  error_message: string;

  isSuccess: boolean = false;
  isEditing: boolean = false;
  isFileUploaded: boolean = false;

  public options = {
    position: ["bottom", "right"],
    timeOut: 5000,
    lastOnBottom: true
  };

  constructor(private router: Router,
    private route: ActivatedRoute,
    private schoolDataService: SchoolDataService,
    private studentService: StudentService,
    private productDataService: ProductDataService,
    private employeeService: EmployeeService,
    private classesDataService: ClassesDataService,
    private personService: PersonService,
    private angularNotifications: AngularNotifications
  ) { }

  ngOnInit() {
    let employee_key = this.route.snapshot.params['employee_key'];
    this.employeeInfo.employee.institution_key = this.schoolDataService.getSchool().school_id;
    if(employee_key){
      this.setEmployee(employee_key);
      this.isEditing = false;
    }
    else{
      this.initEmployee();
      this.isEditing = true;
    }
  }

  setEmployee(employee_key){
    this.employeeService.getEmployee(employee_key).then( resp => {
      this.employeeInfo.employee = resp;
      this.personService.getPerson(resp.person_key).then (person_resp => {
        this.employeeInfo.person = person_resp;
        if(person_resp.profile_image_key){
          this.studentService.getProfilePicture(person_resp.profile_image_key).then(image_resp => {
            this.profile_image_url = image_resp.url;this.employeeInfo.employee.profile_image_key = person_resp.profile_image_key;
          })
        }
      })
    })
  }

  edit(){
    this.isEditing = true;
    this.initEmployee();
  }

  initEmployee(){
    let person: PersonInfo;
    if(!this.employeeInfo.person){
       person = new PersonInfo();
    }
    else{
      person = this.employeeInfo.person;
    }
    if(!person.phone_numbers || person.phone_numbers.length === 0){
      let mobile: PhoneNumber = new PhoneNumber();
      mobile.phone_type = "MOBILE";
      mobile.isd_code = "+91";
      person.phone_numbers = [];
      person.phone_numbers.push(mobile);
    }

    if(!person.email_addresses || person.email_addresses.length === 0){
      let email = new Email()
      email.email_type = "Primary";
      person.email_addresses = [];
      person.email_addresses.push(email);
    }

    if(!person.addresses || person.addresses.length === 0){
      let address = new Address();
      address.address_type = "Residential";
      address.country = "IN";
      person.addresses = [];
      person.addresses.push(address);
    }

    if(!person.immediate_contact){
      let immediate_contact = new ImmediateContact();

      let imm_contact: PhoneNumber = new PhoneNumber();
      imm_contact.phone_type = "MOBILE";
      imm_contact.isd_code = "+91";

      immediate_contact.phone_numbers = [];
      immediate_contact.phone_numbers.push(imm_contact);
      person.immediate_contact = immediate_contact;
    }

    this.employeeInfo.person = person;

    if(!this.employeeInfo.employee.notification_mobile_numbers || this.employeeInfo.employee.notification_mobile_numbers.length === 0){
      let notification_number: Contact = new Contact();
      notification_number.is_verified = false;

      this.employeeInfo.employee.notification_mobile_numbers.push(notification_number);
    }
  }
  //
  // getSubjects(){
  //   return this.schoolDataService.getSchool().subjects;
  // }

  getClasses(){
    let academic_year = this.schoolDataService.getCurrentAcademicYear().code;
    return this.classesDataService.getClasses().filter(x => x.type === 'regular' && x.academic_year === academic_year)
      .sort(function(a,b){return (a.order_index) - (b.order_index)});
  }

  addOrRemoveClass(class_info_key){
    if(!this.employeeInfo.employee.teacher){
      this.employeeInfo.employee.teacher = new Teacher();
      let class_info = new ClassInfo();
      class_info.class_key = class_info_key;
      this.employeeInfo.employee.teacher.classes.push(class_info);
    }
    else{
      if(this.employeeInfo.employee.teacher.classes.length === 0){
        let class_info = new ClassInfo();
        class_info.class_key = class_info_key;
        this.employeeInfo.employee.teacher.classes.push(class_info);
      }
      else{
        let index = this.employeeInfo.employee.teacher.classes.findIndex(x => x.class_key === class_info_key);
        if(index > -1){
          this.employeeInfo.employee.teacher.classes.splice(index,1);
        }
        else{
          let class_info = new ClassInfo();
          class_info.class_key = class_info_key;
          this.employeeInfo.employee.teacher.classes.push(class_info);
        }
      }
    }
  }

  addOrRemoveSubject(code){
    if(!this.employeeInfo.employee.teacher){
      this.employeeInfo.employee.teacher = new Teacher();
      let subject = new Subject();
      subject.code = code;
      this.employeeInfo.employee.teacher.subjects.push(subject);
    }
    else{
      if(this.employeeInfo.employee.teacher.classes.length === 0){
        let subject = new Subject();
        subject.code = code;
        this.employeeInfo.employee.teacher.subjects.push(subject);
      }
      else{
        let index = this.employeeInfo.employee.teacher.subjects.findIndex(x => x.code === code);
        if(index > -1){
          this.employeeInfo.employee.teacher.subjects.splice(index,1);
        }
        else{
          let subject = new Subject();
          subject.code = code;
          this.employeeInfo.employee.teacher.subjects.push(subject);
        }
      }
    }
  }

  isClassSelected(class_info_key){
    if(this.employeeInfo.employee.teacher){
      let index = this.employeeInfo.employee.teacher.classes.findIndex( x => x.class_key === class_info_key);
      if(index > -1){
        return true;
      }else{
        return false;
      }
    }
    else{
      return false;
    }
  }

  isSubjectSelected(code){
    if(this.employeeInfo.employee.teacher){
      let index = this.employeeInfo.employee.teacher.subjects.findIndex( x => x.code === code);
      if(index > -1){
        return true;
      }else{
        return false;
      }
    }
    else{
      return false;
    }
  }

  getSubjectName(code: string){
    let subject = this.schoolDataService.getSchool().academic_configuration.subjects.find(x => x.code === code);
    if(subject){
      return subject.name;
    }
  }

  getClassName(code: string){
    let class_info = this.classesDataService.getClasses().find(x => x.class_info_key === code);
    if(class_info){
      return class_info.name;
    }
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

  getStaffType(code: string){
    let staff_type = this.schoolDataService.getSchool().employee_configuration.staff_type.find(x => x.code === code);
    if(staff_type){
      return staff_type.name;
    }
  }

  getDesignationName(code: string){
    let designation = this.schoolDataService.getSchool().employee_configuration.designations.find(x => x.code === code);
    if(designation){
      return designation.name;
    }
  }

  getDepartmentName(code: string){
    let department = this.schoolDataService.getSchool().departments.find(x => x.code === code);
    if(department){
      return department.name;
    }
  }

  getMaritalStatus(code: string){
    let status = this.productDataService.masterProduct.demographic_configuration.marital_status.find(x => x.code === code);
    if(status){
      return status.name;
    }
  }

  goToEmployeeList(){
    this.router.navigate(['/employee/list']);
  }

  addOrUpdateEmployee(){
    this.employeeInfo.employee.full_name = this.employeeInfo.person.full_name;
    this.employeeInfo.employee.notification_mobile_numbers[0].phone_number = this.employeeInfo.person.phone_numbers[0].phone_number;

    if(this.employeeInfo.employee.employee_key){
      this.updateEmployee();
    }
    else{
      this.addEmployee();
    }
  }

  updateEmployee(){
    this.personService.updatePerson(this.employeeInfo.person).then( person_resp => {
      console.log('[EmployeeInfoComponent] person updated');
      this.employeeService.updateEmployee(this.employeeInfo.employee).then( employee_resp => {
        this.isSuccess = true;
        const toast = this.angularNotifications.success('Success', 'Employee updated', {
          timeOut: 5000,
          showProgressBar: true,
          pauseOnHover: true,
          clickToClose: false,
          clickIconToClose: true
        });
        console.log('[EmployeeInfoComponent] employee updated');
        this.isEditing = false;
        this.setEmployee(this.employeeInfo.employee.employee_key);
      });
    })
  }

  addEmployee(){
    this.personService.addPerson(this.employeeInfo.person).then( person_resp => {
      console.log('[EmployeeInfoComponent] person added.'+person_resp.person_key);
      this.employeeInfo.employee.person_key = person_resp.person_key;
      this.employeeInfo.person.person_key = person_resp.person_key;

      this.employeeService.addEmployee(this.employeeInfo.employee).then( employee_resp => {
        if(employee_resp.employee_key){
            this.isSuccess = true;
            const toast = this.angularNotifications.success('Success', 'Employee added', {
              timeOut: 5000,
              showProgressBar: true,
              pauseOnHover: true,
              clickToClose: false,
              clickIconToClose: true
            });
            console.log('[EmployeeInfoComponent] employee added.'+employee_resp.employee_key);
            this.isEditing = false;
            this.setEmployee(employee_resp.employee_key);
        }
        else{
          this.error_message = "Employee could not be added due to a technical issue";
        }
      });
    })

    if (this.isFileUploaded) {
      this.refreshImage(this.employeeInfo.employee.profile_image_key);
      this.isFileUploaded = false;
    }
  }

  private refreshImage(profile_image_key) {
    if (profile_image_key) {
      this.personService.getProfilePicture(profile_image_key).then(resp => {
        this.profile_image_url = resp.url;
        this.employeeInfo.employee.profile_image_key = resp.url;
        this.employeeInfo.person.profile_image_key = resp.url;
      })
    }
  }

  public onImageUpload(file_management_key: string) {
    this.isFileUploaded = true;
    this.employeeInfo.employee.profile_image_key = file_management_key;
    this.employeeInfo.person.profile_image_key = file_management_key;
  }
}
