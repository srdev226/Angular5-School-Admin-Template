
import { Component, Input, OnInit } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

import { AdmissionApplication, ApplicationData } from './admission-application';
import { School } from '../management/school/school';

import { AdmissionService } from './admission.service';
import { SchoolService } from '../management/school/school.service';
import { StudentService } from '../student/student.service';
import { SchoolDataService } from '../management/school/school-data.service';
import { PersonService } from '../person/person.service';
import { UserAccountDataService } from '../user-account/user-account-data.service';
import { ProductDataService } from '../product/product-data.service';
import { SummaryData } from './summary-box/summary-data';

@Pipe({
  name: 'searchApplication',
  pure: true
})
export class SearchApplication implements PipeTransform {
  transform(apps: ApplicationData[], child_name: string, app_key: any, status: any, class_applied: string, gender: string,
    profession: string, religion: string, caste: string, lower_income: number, higher_income: number, unpaid_key: string, unpaid_app_flag: string): any {
    console.log("[SearchApplicationPipe] ",'app_key : ', app_key, "status", status, "class_applied", class_applied
      , "gender", gender, "profession", profession, "religion", religion, "caste", caste, "unpaid_key", unpaid_key, "unpaid_app_flag", unpaid_app_flag);
    let application_list = apps.filter(x => x.payment_status === 'success');

    if (child_name) {
      application_list = application_list.filter(x => {
        return (x.additional_information.candidate.full_name.toLowerCase().includes(child_name.toLowerCase()));
      })
    }
    if (app_key) {
      application_list = application_list.filter(x => {
        return (x && x.application_key.toLowerCase().slice(0, 5).includes(app_key.toLowerCase()));
      })
    }
    if (status !== 'All') {
      application_list = application_list.filter(x => {
        return (x.status.toLowerCase().includes(status.toLowerCase()));
      })
    }
    if (class_applied !== 'All') {
      application_list = application_list.filter(x => {
        return (x.class_applied && x.class_applied.toLowerCase().includes(class_applied.toLowerCase()));
      })
    }
    if (gender !== 'All') {
      application_list = application_list.filter(x => {
        return (x.additional_information.candidate.gender && x.additional_information.candidate.gender !== undefined && x.additional_information.candidate.gender.toString().toLowerCase().startsWith(gender.toLowerCase()));
      })
    }
    if (profession !== 'All') {
      application_list = application_list.filter(x => {
        return (x.additional_information.parent_professions.indexOf(profession) > -1);
      })
    }
    if (religion !== 'All') {
      application_list = application_list.filter(x => {
        return (x.additional_information.candidate.religion && x.additional_information.candidate.religion !== undefined && x.additional_information.candidate.religion.toLowerCase().startsWith(religion.toLowerCase()));
      })
    }
    if (caste !== 'All') {
      application_list = application_list.filter(x => {
        return (x.additional_information.candidate.caste && x.additional_information.candidate.caste !== undefined && x.additional_information.candidate.caste.toLowerCase().startsWith(caste.toLowerCase()));
      })
    }
    if (lower_income) {
      application_list = application_list.filter(x => {
        return (parseInt(x.additional_information.family_income) > lower_income);
      })
    }
    if (higher_income) {
      application_list = application_list.filter(x => {
        return (parseInt(x.additional_information.family_income) < higher_income);
      })
    }
    if (unpaid_app_flag == 'true') {
      application_list = apps.filter(x => x.payment_status !== 'success');
      if(unpaid_key && unpaid_key.length > 0){
        application_list = application_list.filter(x => {
          return (x.application_key.startsWith(unpaid_key));
        })
      }
    }
    return application_list;
  }
}

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.css']
})

export class ApplicationListComponent implements OnInit {

  admission_application: ApplicationData[] = [];
  selected_application_item: AdmissionApplication;

  school: School = new School();
  summaryData: SummaryData[] = [];
  schoolID: string;
  advanced_search_flag: boolean = true;
  unpaid_flag: boolean = false;

  application_status = ["Completed", "New", "Review", "Accepted", "Rejected", "Enrolled"];
  unpaid_app_keys: string[];

  selected_unpaid_key: string;
  selected_status: string = 'All';
  selected_class: string = 'All';
  selected_gender: string = 'All';
  selected_profession: string = 'All';
  selected_religion: string = 'All';
  selected_caste: string = 'All';
  application_key: string;
  full_name: string;
  annual_income_lower: string;
  annual_income_higher: string;
  showfilter: boolean;
  is_applications_loaded: boolean;

  constructor(private admissionService: AdmissionService,
    private schoolService: SchoolService,
    private personService: PersonService,
    private userAccountDataService: UserAccountDataService,
    private schoolDataService: SchoolDataService,
    private studentService: StudentService,
    public productDataService: ProductDataService
  ) { }

  ngOnInit(): void {
    this.showfilter = false;
    this.schoolID = this.userAccountDataService.getUserAccount().school_key;
    this.getApplicationList();
    this.setSummaryData();
    this.advanced_search_flag = true;
    this.school = this.schoolDataService.getSchool();
  }

  toggleFilter(){
    this.showfilter = !this.showfilter;
  }

  resetFilter() {
    this.selected_status = 'All';
    this.selected_class = 'All';
    this.selected_gender = 'All';
    this.selected_profession = 'All';
    this.selected_religion = 'All';
    this.selected_caste = 'All';
    this.application_key = '';
    this.annual_income_lower = '';
    this.annual_income_higher = '';
    this.full_name = '';
  }

  resetUnpaidKey(){
    this.selected_unpaid_key = "";
  }

  onApplicationStatusChange() {
    this.setSummaryData();
    this.getApplicationList();
    this.resetFilter();
    this.resetUnpaidKey();
  }

  setSummaryData() {
    let school_id = this.userAccountDataService.getUserAccount().school_key;;
    this.admissionService.getSummaryBoxDetails(school_id).then(resp =>
      this.summaryData = resp);
  }

  setApplicationsFilterStatus(status: string) {
    console.log('[ApplicationListComponent] getApplicationListByStatus ' + status);
    this.resetFilter();
    this.resetUnpaidKey();
    this.selected_status = status;
    this.selected_application_item = null;
  }

  getApplicationList(): void {
    this.unpaid_app_keys = [];
    if (this.schoolID) {
      this.admissionService.getApplicationsBySchool(this.schoolID)
        .then(app_resp => {
          let list = app_resp.filter(x=>x.additional_information && x.additional_information.candidate);
          this.admission_application = [];
          for(let app of list){
            if(app.payment_status !== 'success'){
              this.unpaid_app_keys.push(app.application_key);
            }
            this.admission_application.push(app);
          }
          this.is_applications_loaded = true;
        });
    }
  }

  public getStudentProfilePicURL(profile_image_key, gender){
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
  
  onSelect(applicationData: ApplicationData): void {
    this.admissionService.getApplication(applicationData.application_key)
      .then(app_resp => {
        this.selected_application_item = new AdmissionApplication();
        this.selected_application_item.applicationData = app_resp;
      });
    }

    public downloadCsv(csv, student) {
      var csvFile;
      var downloadLink;
      csvFile = new Blob([csv], {type: "csv"});
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

}
