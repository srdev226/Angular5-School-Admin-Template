import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Pipe,PipeTransform} from '@angular/core';

import { EmployeeInfo} from '../employee-info/employee-info';
import { Employee } from '../employee';
import { PersonInfo } from '../../person/person';
import { ContactInfo } from '../../communication/contact-info';
import { PhoneNumber} from '../../common/phone-number';

import { EmployeeService } from '../employee.service';
import { StudentService } from '../../student/student.service';
import { PersonService } from '../../person/person.service';
import { School } from '../../management/school/school';
import { SchoolDataService } from '../../management/school/school-data.service';
import { NotificationsService as AngularNotifications } from 'angular2-notifications' ;

@Pipe({
    name: 'searchEmployee',
    pure: true
})

export class SearchEmployee implements PipeTransform {

    constructor()
    {}

    transform(employees: EmployeeInfo[],emp_name: string, emp_code: string, staff_type: string, select_all: string): any {
      console.log('emp_name: '+emp_name+' emp_code: '+emp_code+' staff_type: '+staff_type+' select_all: '+select_all);
      if(select_all){
        return employees;
      }
      if(!emp_name && !emp_code && staff_type === 'All'){
        return [];
      }
      let employee_list = employees;

      if (emp_name) {
        employee_list = employee_list.filter(x => {
          return (x.employee.full_name.toLowerCase().includes(emp_name.toLowerCase()));
        })
      }
      if (emp_code) {
        employee_list = employee_list.filter(x => {
          return (x.employee.emp_code.toLowerCase().includes(emp_code.toLowerCase()));
        })
      }
      if (staff_type !== 'undefined' && staff_type !=="All") {
        employee_list = employee_list.filter(x => {
          return (x.employee.type_code === staff_type);
        })
      }

      return employee_list;
    }
}

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})

export class EmployeeListComponent implements OnInit {

  school:School;
  employee_info_list: EmployeeInfo[] = [];
  employee_list: Employee[] = [];
  employee_info: EmployeeInfo[] = [];

  employee_name: string;
  employee_code: string;
  employee_type: string = "All";
  select_or_unselect: string;

  sendMsgFlag: boolean = false;
  employeePrint: boolean = false;
  istype:boolean = false;
  isdob: boolean = false;
  isgender: boolean = false;
  isqulify: boolean = false;
  isdept: boolean = false;
  isdesig: boolean = false;
  ismob: boolean = false;



  public options = {
    position: ["bottom", "right"],
    timeOut: 5000,
    lastOnBottom: true
  };

  constructor(private router: Router,
              private route: ActivatedRoute,
              private employeeService: EmployeeService,
              private studentService: StudentService,
              private personService: PersonService,
              private schoolDataService: SchoolDataService,
              private angularNotifications: AngularNotifications
  ) { }

  ngOnInit() {
    this.school = this.schoolDataService.getSchool();
    this.getEmployeeList();
  }

  getEmployeeList(){
    this.employee_info_list = [];
    this.employeeService.getEmployeeList(this.schoolDataService.getSchool().school_id).then( resp => {
      this.employee_list = resp.filter(x => x.type_code !== undefined);
      for(let employee of this.employee_list){
        let emp_info = new EmployeeInfo();
        emp_info.employee = employee;
        this.employee_info_list.push(emp_info);
      }
        this.getEmployeeDetails();
    });

  }
  public getEmployeeDetails(){
    this.employee_info = [];
    for(let emp of this.employee_info_list){
    this.employeeService.getEmployee(emp.employee.employee_key).then( emp_resp => {
      this.personService.getPerson(emp.employee.person_key).then( person_resp =>{
      let _emp = new EmployeeInfo();
      _emp.employee = emp_resp;
      if(person_resp.dob){
      _emp.person.dob = person_resp.dob;
      }
      this.employee_info.push(_emp)
      });
    });
    }
  }

  public getEmployeeProfilePicURL(profile_image_key, gender){
    let url = '';
    if(profile_image_key){
      url = this.studentService.getProfilePictureUrl(profile_image_key);
    } else if (gender == 'Male') {
      url = 'assets/images/boy.png';
    } else {
      url = 'assets/images/girl.png';
    }
    return url;
  }

  gotoAddEmployee(){
      this.router.navigate(['employee/add']);
  }

  gotoEditEmployee(employee_key){
        this.router.navigate(['/employee/edit',employee_key]);
  }

  getStaffType(code: string){
    if(this.schoolDataService.getSchool().employee_configuration){
      let staff_type = this.schoolDataService.getSchool().employee_configuration.staff_type.find(x => x.code === code);
      if(staff_type){
        return staff_type.name;
      }
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

  public sendMessage() {
    this.sendMsgFlag = true;
  }

  public takePrint(){
    this.employeePrint = true;
  }

  public back(){
    this.employeePrint = false;
  }
  isType(e) {
    if (e.target.checked) {
       this.istype= true;
    } else {
       this.istype= false;
    }
  }
  isDob(e) {
    if (e.target.checked) {
       this.isdob= true;
    } else {
       this.isdob= false;
    }
  }
  isQulification(e) {
    if (e.target.checked) {
       this.isqulify= true;
    } else {
       this.isqulify= false;
    }
  }
  isDept(e) {
    if (e.target.checked) {
       this.isdept= true;
    } else {
       this.isdept= false;
    }
  }
  isDesig(e) {
    if (e.target.checked) {
       this.isdesig= true;
    } else {
       this.isdesig= false;
    }
  }
  isMob(e) {
    if (e.target.checked) {
       this.ismob= true;
    } else {
       this.ismob= false;
    }
  }

  public onMessageSent(status: string){
    if(status === "success"){
      const toast = this.angularNotifications.success('', 'SMS sent', {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: false,
        clickIconToClose: true
      });
      this.sendMsgFlag = false;
    }
    else if(status === "failed"){
      const toast = this.angularNotifications.error('', 'SMS sending failed', {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: false,
        clickIconToClose: true
      });
      this.sendMsgFlag = true;
    }
    else if(status === "cancelled"){
      this.sendMsgFlag = false;
    }
  }

  getContactList(){
    let empPipe = new SearchEmployee();
    let emp_info_list = empPipe.transform(this.employee_info_list, this.employee_name, this.employee_code, this.employee_type, this.select_or_unselect);

    let contact_info_list: ContactInfo[] = [];
    for(let info of emp_info_list){
      let contact = new ContactInfo();
      contact.full_name = info.employee.full_name;
      contact.contact_key = info.employee.employee_key;
      contact.gender =(info.person.gender) ? info.person.gender.toString(): null;
      contact.id_code = info.employee.emp_code;
      contact.profile_image_url = info.profile_image_url;
      contact.notification_mobile_numbers = info.employee.notification_mobile_numbers;
      contact_info_list.push(contact);
    }
    return contact_info_list;
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
          }
          td, th{
              border: 1px solid #424242;
              text-align: left;
              padding: 8px;
          }
          .value{
             border-top: 2px solid black;
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

  public downloadCsv(csv, employee) {
    var csvFile;
    var downloadLink;
    csvFile = new Blob([csv], {type: "text/csv"});
    downloadLink = document.createElement("a");
    downloadLink.download = employee;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  public export_table_to_csv(employee) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");
    for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll("td, th");
      for (var j = 0; j < cols.length; j++)
      row.push(cols[j].textContent);
      csv.push(row.join(","));
    }
    this.downloadCsv(csv.join("\n"), employee);
  }

}
