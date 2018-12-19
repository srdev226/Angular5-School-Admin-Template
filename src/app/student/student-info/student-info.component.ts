import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { PhoneNumber as Contact } from '../../common/phone-number';
import { PersonInfo, PhoneNumber, Email, Address, NotificationDetails, IdentityInformation } from '../../person/person';
import { StudentInfo } from './student-info';
import { School, Divisions, AcademicYear } from '../../management/school/school';
import { ClassInfo } from '../../academics/classes/class-info';
import { StudentService } from '../student.service';
import { PersonService } from '../../person/person.service';
import { ProductDataService } from '../../product/product-data.service';
import { PersonResponse } from '../../person/person-response';
import { StudentResponse } from '../student-response';
import { SchoolDataService } from '../../management/school/school-data.service';
import { ClassesDataService } from '../../academics/classes/classes-data.service';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css']
})

export class StudentInfoComponent implements OnInit {

  school: School = new School();
  academic_years: AcademicYear[];
  divisions: Divisions[];
  classesList: ClassInfo[];
  currentClass: ClassInfo;
  studentInfo: StudentInfo = new StudentInfo();
  mother: PersonInfo = new PersonInfo();
  father: PersonInfo = new PersonInfo();
  private d3: D3;

  target_student: HTMLInputElement;
  target_mother: HTMLInputElement;
  target_father: HTMLInputElement;

  tab = 'student';
  isEditing: boolean = false;
  isSuccess: boolean = false;
  isStudentProfileEdit: boolean;
  isFileUploaded: boolean = false;
  isMotherFileUploaded: boolean = false;
  isFatherFileUploaded: boolean = false;

  profile_image_key: string;
  m_profile_image_key: string;
  f_profile_image_key: string;
  profile_image_url: string;
  m_profile_image_url: string;
  f_profile_image_url: string;
  error_message: string;
  selected_contact: string;
  notification_contact_name: string;
  current_academic_year: string;

  notification_numbers: NotificationDetails[] = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private personService: PersonService,
    private productDataService: ProductDataService,
    private schoolDataService: SchoolDataService,
    private classesDataService: ClassesDataService,
    d3Service: D3Service
  ) {
    this.d3 = d3Service.getD3();
  }

  updateContact(value) {
    this.selected_contact = value;
  }

  initPieChart2 = function () {
    //applications-pie-chart
    let d3 = this.d3;
    var donut = this.donutChart1();
    var data = [
      {
        "Status": "NEW",
        "Value": 0.056
      },
      {
        "Status": "INPROGRESS",
        "Value": 0.044
      }
    ];
    d3.select('#applications-pie-chart')
      .datum(data) // bind data to the div
      .call(donut); // draw chart in div
  }

  donutChart1 = function () {
    let d3 = this.d3;
    var width = 320,
      height = 160,
      margin = { top: 10, right: 10, bottom: 10, left: 10 },
      colour = d3.scaleOrdinal(d3.schemeCategory20c), // colour scheme
      variable = 'Status', // value in data that will dictate proportions on chart
      category = 'Value', // compare data by
      padAngle = 0.185, // effectively dictates the gap between slices
      floatFormat = d3.format('.4r'),
      cornerRadius = 5, // sets how rounded the corners are on each slice
      percentFormat = d3.format(',.2%');

    var chart = function (selection) {
      selection.each(function (data) {
        var radius = Math.min(width, height) / 2;

        var pie = d3.pie()
          .value(function (d) { return floatFormat(d[variable]); })
          .sort(null);

        var arc = d3.arc()
          .outerRadius(radius * 0.8)
          .innerRadius(radius * 0.6)
          .cornerRadius(cornerRadius)
          .padAngle(padAngle);


        var outerArc = d3.arc()
          .outerRadius(radius * 1.9)
          .innerRadius(radius * 1.9);

        var svg = selection
          // .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + (width / 2.8) + ',' + height / 1.8 + ')');

        svg.append('g').attr('class', 'slices');
        svg.append('g').attr('class', 'labelName');
        svg.append('g').attr('class', 'lines');

        var colors = [],
          slice = 0,
          inPad = false,
          padding = 0.04;


        var path = svg.select('.slices')
          .datum(data).selectAll('path')
          .data(pie)
          .enter().append('path')
          .style('fill', 'url(#green_blue)')
          .style('stroke', 'url(#green_blue_border)')
          //  function (d) {
          //   if (d.data.Fees == 'Collected') {
          //     return 'url(#red_black_border)';
          //   }
          //   else
          //     return 'none';
          // })
          .style('stroke-width', '2')
          // .style('stroke-fill','url(#red_black_border)')
          // .attr('fill', function (d) {
          //   return d.fill;
          // })
          .attr('d', arc);
        // .style('filter', 'url(#dropshadow-pie)');

        // var label = svg.select('.labelName').selectAll('text')
        //   .data(pie)
        //   .enter().append('text')
        //   .attr('dy', '.35em')
        //   .html(function (d) {
        //     // add "key: value" for given category. Number inside tspan is bolded in stylesheet.
        //     return d.data[category] + ': <tspan>' + percentFormat(d.data[variable]) + '</tspan>';
        //   })
        //   .attr('transform', function (d) {
        //     var pos = outerArc.centroid(d);
        //     pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        //     return 'translate(' + pos + ')';
        //   })
        //   .style('text-anchor', function (d) {
        //     return (midAngle(d)) < Math.PI ? 'start' : 'end';
        //   });

        // var polyline = svg.select('.lines')
        //   .selectAll('polyline')
        //   .data(pie)
        //   .enter().append('polyline')
        //   .attr('points', function (d) {

        //     // see label transform function for explanations of these three lines.
        //     var pos = outerArc.centroid(d);
        //     pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        //     return [arc.centroid(d), outerArc.centroid(d), pos]
        //   });

        d3.selectAll('#applications-pie-chart .labelName text,#applications-pie-chart .slices path').call(toolTipApplications);

        function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }

        function toolTipApplications(selection) {
          selection.on('mouseenter', function (data) {

            svg.append('text')
              .attr('class', 'toolCircle')
              .attr('dy', -15) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
              .html(toolTipHTMLApplications(data)) // add text to the circle.
              .style('font-size', '.9em')
              .style('text-anchor', 'middle'); // centres text in tooltip

            svg.append('circle')
              .attr('class', 'toolCircle')
              .attr('r', radius * 0.55) // radius of tooltip circle
              .style('fill', 'none') // colour based on category mouse is over
              .style('fill-opacity', 0.35);

          });

          // remove the tooltip when mouse leaves the slice/label
          selection.on('mouseout', function () {
            d3.selectAll('.toolCircle').remove();
          });
        }

        function toolTipHTMLApplications(data) {

          var tip = '',
            i = 0;

          for (var key in data.data) {

            // if value is a number, format it as a percentage
            var value = data.data[key];
            if (i === 0)
              tip += '<tspan x="0" dy="0.005em" class="tspan-key">' + value + '</tspan>';
            else
              tip += '<tspan x="0" dy="1.2em" class="tspan-value">' + value + '</tspan>';
            i++;
          }

          return tip;
        }

      });
    }

    return chart;
  }

  ngOnInit() {
    this.school = this.schoolDataService.getSchool();
    this.isEditing = true;
    this.studentInfo = new StudentInfo();
    this.studentInfo.student.current_class = "-1";
    this.studentInfo.student.division = "-1";
    this.studentInfo.student.admission_year = "-1";
    this.initParents();
    this.initPieChart2();
    this.current_academic_year = this.schoolDataService.getCurrentAcademicYear().code;
    this.setClassesList();
    this.academic_years = this.school.academic_years.sort(function(a,b){return +(a.start_date) - +(b.start_date)});
    let student_key = this.route.snapshot.params['student_key'];
    if (student_key) {
      this.isEditing = false;
      this.setStudentDetails(student_key);
    }
  }

  private setClassesList(){
      this.classesList = this.classesDataService.getClasses().filter(x => (x.academic_year === this.current_academic_year && x.type === "regular"))
       .sort(function(a,b){return (a.order_index) - (b.order_index)});
  }

  private initParents(){
    this.initPerson(this.mother);
    this.initPerson(this.father);
    this.initStudent(this.studentInfo.person);
  }


  private initPerson(person: PersonInfo){
    if(!person.phone_numbers || person.phone_numbers.length === 0){
      let mobile: PhoneNumber = new PhoneNumber();
      mobile.phone_type = "MOBILE";
      mobile.isd_code = "+91";
      if(!person.phone_numbers){
        person.phone_numbers = []
      }
      person.phone_numbers.push(mobile);
    }
    if(!person.email_addresses || person.email_addresses.length === 0){
      let email = new Email()
      email.email_type = "Primary";
      if(!person.email_addresses){
        person.email_addresses = []
      }
      person.email_addresses.push(email);
    }
    if(!person.addresses || person.addresses.length === 0){
      let address = new Address();
      address.address_type = "Residential";
      address.country = "IN";
      if(!person.addresses){
        person.addresses = []
      }
      person.addresses.push(address);
    }
   }

   private initStudent(person: PersonInfo){
     if(!person.identity_information || person.identity_information.length === 0){
      person.identity_information = []
      let id = new IdentityInformation();
      id.type = "AADHAAR";
      id.is_verified = false;
      person.identity_information.push(id);
      console.log("id",this.studentInfo.person.identity_information)
    }
   }

  private setStudentDetails(studentKey: string) {

    this.studentService.getStudent(studentKey).then(resp => {
      this.studentInfo.student = resp;
      if(this.studentInfo.student.current_class_key){
        this.currentClass = this.classesDataService.getClasses().find( x => x.class_info_key === this.studentInfo.student.current_class_key);
        this.current_academic_year = this.currentClass.academic_year;
        this.setClassesList();
        this.setDivisions(this.studentInfo.student.current_class_key);
      }

      if(resp.profile_image_key){
        this.profile_image_key = resp.profile_image_key;
        this.studentService.getProfilePicture(resp.profile_image_key).then(image_response => {
          this.profile_image_url = image_response.url;
         this.studentInfo.profile_image_url=image_response.url;
        });
      }

      let person_responses = []
      let student_person_response = this.personService.getPerson(resp.person_key).then(person_response => {
        this.studentInfo.person = person_response;
      });
      person_responses.push(student_person_response);

      if(resp.mother_person_key){
        let mother_person_response = this.personService.getPerson(resp.mother_person_key).then(mother_resp => {
          this.mother = mother_resp;
          this.setNotificationNumbers(mother_resp);
        }).then(() => {
          if (this.mother.profile_image_key) {
            this.studentService.getProfilePicture(this.mother.profile_image_key).then(image_response => {
              this.m_profile_image_url = image_response.url;
              this.m_profile_image_key = this.mother.profile_image_key;
            });
          }
        });
        person_responses.push(mother_person_response);
      }

      if(resp.father_person_key){
        let father_person_response = this.personService.getPerson(resp.father_person_key).then(father_resp => {
          this.father = father_resp;
          this.setNotificationNumbers(father_resp);
        }).then(() => {
          if (this.father.profile_image_key) {
            this.studentService.getProfilePicture(this.father.profile_image_key).then(image_response => {
              this.f_profile_image_url = image_response.url;
              this.f_profile_image_key = this.father.profile_image_key;
            });
          }
        });
        person_responses.push(father_person_response);
      }
      Promise.all(person_responses).then( x => {
        this.initParents();
      });

    });
  }

  private setDivisions(selected_class_key: string){
      this.divisions = this.classesDataService.getDivisionCodesList(this.current_academic_year, selected_class_key);
  }


  private setNotificationNumbers(person: PersonInfo) {
    if (!this.notification_numbers) {
      this.notification_numbers = [];
    }
    if (person.phone_numbers && person.phone_numbers[0].phone_number) {
      let no = new NotificationDetails();
      no.notification_number = person.phone_numbers[0].phone_number;
      no.name = person.full_name;
      no.person_key = person.person_key;

      if(!this.notification_numbers.find(x => x.person_key === person.person_key)){
        this.notification_numbers.push(no);
      }
      if(this.studentInfo.student.notification_mobile_numbers && this.studentInfo.student.notification_mobile_numbers.length>0){
        let student_notification_no =
          this.studentInfo.student.notification_mobile_numbers[this.studentInfo.student.notification_mobile_numbers.length - 1].phone_number;
        if (person.phone_numbers[0].phone_number === student_notification_no) {
          this.notification_contact_name = person.full_name;
          this.selected_contact = person.person_key;
        }
      }
    }
  }

  addOrUpdateStudent() {
    this.studentInfo.student.school_id = this.schoolDataService.getSchool().school_id + "";
    this.studentInfo.student.full_name = this.studentInfo.person.full_name;
    this.studentInfo.student.gender = this.studentInfo.person.gender;
    this.studentInfo.student.current_class = this.classesDataService.getClasses().
                                              find(x => (x.class_info_key === this.studentInfo.student.current_class_key)).name;

    if(this.studentInfo.student.student_key){
        this.updateStudent();
    }
    else {
      this.addStudent();
    }
  }

  private addStudent() {
    this.personService.addPerson(this.studentInfo.person).then(personAddResponse => {
      this.studentInfo.student.person_key = personAddResponse.person_key;
      this.studentService.addStudent(this.studentInfo.student).then(addStudentResponse => {
        if (addStudentResponse.student_key) {
          this.isSuccess = true;
          console.log('[StudentInfoComponent] Student details added ');
          this.router.navigate(['student/list'], { queryParams: { isAdded: true, studentDetails: this.studentInfo.person.full_name } });
        }
        else {
          this.error_message = "Student could not be added due to a technical issue";
        }
      });
      if (this.isFileUploaded) {
        this.refreshImage(this.studentInfo.person);
        this.isFileUploaded = false;
      }
    });
  }

    updateContactNumber(person_key){
      this.studentInfo.student.notification_mobile_numbers = [];
      this.personService.getPerson(person_key).then( resp => {
        if(this.selected_contact === person_key){
          let contact_person = resp;
          let contact = new Contact();
          contact.country_code = contact_person.phone_numbers[0].isd_code ? contact_person.phone_numbers[0].isd_code : '+91';
          contact.is_verified = false;
          contact.phone_number = contact_person.phone_numbers[0].phone_number;
          this.studentInfo.student.notification_mobile_numbers.push(contact);
          this.studentService.updateStudent(this.studentInfo.student).then(updateStudentResponse => {
            this.isEditing = false;
            this.setStudentDetails(this.studentInfo.student.student_key);
          });
        }
        let index = this.notification_numbers.findIndex(x => x.person_key === person_key);
        if(index > -1){
          this.notification_numbers.splice(index,1);
          this.setNotificationNumbers(resp);
        }
      });
    }

  private updateStudent() {

    ///Update Mother details
    if (this.tab === 'mother') {
      if (this.mother.dob !== null && this.mother.dob !== undefined && this.mother.dob.toString().length < 1) {
        this.mother.dob = null;
      }
      if (this.mother.email_addresses[0] != null && this.mother.email_addresses[0] != undefined) {
        if (this.mother.email_addresses[0].email_id !== null && this.mother.email_addresses[0].email_id !== undefined) {
          if (this.mother.email_addresses[0].email_id.length < 1) {
            this.mother.email_addresses[0].email_id = null;
          }
        }
        else {
          this.mother.email_addresses[0].email_id = null;
        }
      }
      if (this.mother.phone_numbers[0] !== null && this.mother.phone_numbers[0] !== undefined) {
        if (this.mother.phone_numbers[0].phone_number !== null && this.mother.phone_numbers[0].phone_number !== undefined) {
          if (this.mother.phone_numbers[0].phone_number.length < 1) {
            this.mother.phone_numbers[0].phone_number = null;
          }
        }
        else {
          this.mother.phone_numbers[0].phone_number = null;
        }
      }
      if (this.mother.addresses[0] !== null && this.mother.addresses[0] !== undefined && this.mother.addresses[0].address_line1 !== null && this.mother.addresses[0].address_line1 !== undefined && this.mother.addresses[0].address_line1.length < 1) {
        this.mother.addresses[0].address_line1 = null;
      }
      if (this.mother.addresses[0] !== null && this.mother.addresses[0] !== undefined && this.mother.addresses[0].address_line2 !== null && this.mother.addresses[0].address_line2 !== undefined && this.mother.addresses[0].address_line2.length < 1) {
        this.mother.addresses[0].address_line2 = null;
      }
      if (this.mother.addresses[0] !== null && this.mother.addresses[0] !== undefined && this.mother.addresses[0].pincode !== null && this.mother.addresses[0].pincode !== undefined && this.mother.addresses[0].pincode.toString().length < 1) {
        this.mother.addresses[0].pincode = null;
      }
      if (this.mother.addresses[0] !== null && this.mother.addresses[0] !== undefined && this.mother.addresses[0].state !== null && this.mother.addresses[0].state !== undefined && this.mother.addresses[0].state.length < 1) {
        this.mother.addresses[0].state = null;
      }
      if (this.studentInfo.student.mother_person_key !== null && this.studentInfo.student.mother_person_key !== undefined) {
        this.personService.updatePerson(this.mother).then(mother_resp => {
          console.log('[StudentInfoComponent] mother details updated');
          this.isEditing = false;
          if(this.mother.phone_numbers[0] !== null){
            this.updateContactNumber(this.mother.person_key);
          }
          this.setStudentDetails(this.studentInfo.student.student_key);
          if (this.isMotherFileUploaded) {
            this.refreshImage(this.mother);
            this.isMotherFileUploaded = false;
          }
        });
      }
      else if (this.mother.full_name !== null && this.mother.full_name !== undefined) {
        this.personService.addPerson(this.mother).then(mother_resp => {
          this.studentInfo.student.mother_person_key = mother_resp.person_key;
          console.log('[StudentInfoComponent] Mother details added '+this.mother.full_name);
          //Update student Contact Number
          if(this.mother.phone_numbers[0] !== null && !this.studentInfo.student.father_person_key){
            this.updateContactNumber(mother_resp.person_key);
          }
          this.studentService.updateStudent(this.studentInfo.student).then(updateStudentResponse => {
              console.log('[StudentInfoComponent] student updated ...');
              this.isEditing = false;
              this.setStudentDetails(this.studentInfo.student.student_key);
            });
          if(this.isMotherFileUploaded){
            this.refreshImage(this.mother);
            this.isMotherFileUploaded = false;
          }
        });
      }
    }

    ///Update Father details
    if (this.tab === 'father') {
      if (this.father.dob !== undefined && this.father.dob !== null && this.father.dob.toString().length < 1) {
        this.father.dob = null;
      }
      if (this.father.email_addresses[0] != null && this.father.email_addresses[0] != undefined) {
        if (this.father.email_addresses[0].email_id !== null && this.father.email_addresses[0].email_id !== undefined) {
          if (this.father.email_addresses[0].email_id.length < 1) {
            this.father.email_addresses[0].email_id = null;
          }
        }
        else {
          this.father.email_addresses[0].email_id = null;
        }
      }
      if (this.father.phone_numbers[0] !== null && this.father.phone_numbers[0] !== undefined) {
        if (this.father.phone_numbers[0].phone_number !== null && this.father.phone_numbers[0].phone_number !== undefined) {
          if (this.father.phone_numbers[0].phone_number.length < 1) {
            this.father.phone_numbers[0].phone_number = null;
          }
        }
        else {
          this.father.phone_numbers[0].phone_number = null;
        }
      }
      if (this.father.addresses[0] !== null && this.father.addresses[0] !== undefined && this.father.addresses[0].address_line1 !== null && this.father.addresses[0].address_line1 !== undefined && this.father.addresses[0].address_line1.length < 1) {
        this.father.addresses[0].address_line1 = null;
      }
      if (this.father.addresses[0] !== null && this.father.addresses[0] !== undefined && this.father.addresses[0].address_line2 !== null && this.father.addresses[0].address_line2 !== undefined && this.father.addresses[0].address_line2.length < 1) {
        this.father.addresses[0].address_line2 = null;
      }
      if (this.father.addresses[0] !== null && this.father.addresses[0] !== undefined && this.father.addresses[0].pincode !== null && this.father.addresses[0].pincode !== undefined && this.father.addresses[0].pincode.toString().length < 1) {
        this.father.addresses[0].pincode = null;
      }
      if (this.father.addresses[0] !== null && this.father.addresses[0] !== undefined && this.father.addresses[0].state !== null && this.father.addresses[0].state !== undefined && this.father.addresses[0].state.length < 1) {
        this.father.addresses[0].state = null;
      }

      if(this.studentInfo.student.father_person_key !== null && this.studentInfo.student.father_person_key !== undefined){
          this.personService.updatePerson(this.father).then(father_resp=>{
            console.log('[StudentInfoComponent] father details updated ');
            this.isEditing = false;
            if(this.father.phone_numbers[0] !== null){
              this.updateContactNumber(this.father.person_key);
            }
            this.setStudentDetails(this.studentInfo.student.student_key);
            if(this.isFatherFileUploaded){
              this.refreshImage(this.father);
              this.isFatherFileUploaded = false;
            }
          });
      }else if(this.father.full_name !== null && this.father.full_name !== undefined){
          this.personService.addPerson(this.father).then(father_resp=>{
            this.studentInfo.student.father_person_key = father_resp.person_key;
            console.log('[StudentInfoComponent] Father details added '+this.father.full_name);
            //Update student Contact Number
            if(this.father.phone_numbers[0] !== null && !this.studentInfo.student.mother_person_key){
              this.updateContactNumber(father_resp.person_key);
            }
              this.studentService.updateStudent(this.studentInfo.student).then(updateStudentResponse => {
                console.log('[StudentInfoComponent] student updated ...');
                this.isEditing = false;
                this.setStudentDetails(this.studentInfo.student.student_key);
              });
            if(this.isFatherFileUploaded){
              this.refreshImage(this.father);
              this.isFatherFileUploaded = false;
              }
          });
         }
      }

      if(this.tab === "student"){
        if (this.studentInfo.person.identity_information[0] != null && this.studentInfo.person.identity_information[0] != undefined) {
          if (this.studentInfo.person.identity_information[0].id_number !== null && this.studentInfo.person.identity_information[0].id_number !== undefined) {
            if (this.studentInfo.person.identity_information[0].id_number.toString().length < 1) {
              this.studentInfo.person.identity_information[0].id_number = "0";
            }
          }
          else {
            this.studentInfo.person.identity_information[0].id_number = "0";
          }
        }
        if(this.selected_contact){
          this.studentInfo.student.notification_mobile_numbers = [];
          let contact_person = this.mother.person_key === this.selected_contact ? this.mother : this.father;
          let contact = new Contact();
          contact.country_code = contact_person.phone_numbers[0].isd_code ? contact_person.phone_numbers[0].isd_code : '+91';
          contact.is_verified = false;
          contact.phone_number = contact_person.phone_numbers[0].phone_number;
          this.studentInfo.student.notification_mobile_numbers.push(contact);
        }
        this.personService.updatePerson(this.studentInfo.person).then(personAddResponse => {
          console.log('[StudentInfoComponent] person updated');
          this.studentService.updateStudent(this.studentInfo.student).then(updateStudentResponse => {
            console.log('[StudentInfoComponent] student updated ...');
            this.isEditing = false;
            this.setStudentDetails(this.studentInfo.student.student_key);
          });
          if (this.isFileUploaded) {
            this.refreshImage(this.studentInfo.person);
            this.isFileUploaded = false;
          }
        });
      }

  }

  goToStudentList() {
    this.router.navigate(['student/list']);
  }

  addNew() {
    this.studentInfo = new StudentInfo();
    this.isSuccess = false;
  }

  public onImageUpload(file_management_key: string) {
    console.log('[ProfileComponent] Image uploaded ...', file_management_key);

    if (this.tab === 'mother') {
      this.isMotherFileUploaded = true;
      this.mother.profile_image_key = file_management_key;
    }
    if (this.tab === 'father') {
      this.isFatherFileUploaded = true;
      this.father.profile_image_key = file_management_key;
    }
    if (this.tab === 'student') {
      this.isFileUploaded = true;
      this.studentInfo.student.profile_image_key = file_management_key;
    }
  }

  private refreshImage(person: PersonInfo) {
    if (person.profile_image_key) {
      this.personService.getProfilePicture(person.profile_image_key).then(resp => {
        if (this.tab === 'mother') {
          this.m_profile_image_url = resp.url;;
          this.m_profile_image_key = person.profile_image_key;
        }
        if (this.tab === 'father') {
          this.f_profile_image_url = resp.url;;
          this.f_profile_image_key = person.profile_image_key;
        }
        if (this.tab === 'student') {
          this.profile_image_url = resp.url;;
          this.profile_image_key = person.profile_image_key;
        }
      })
    }
  }

}
