import { Component, OnInit, Input } from '@angular/core';
import { ProductDataService } from '../../../product/product-data.service';
import { SchoolDataService } from '../../../management/school/school-data.service';
import { StudentInfo } from '../student-info';
import * as moment from 'moment';
import { StudentService } from '../../../student/student.service';
import { FeeBillService } from '../../../fee/fee-bill/fee-bill.service';
import { NotificationsService } from 'angular2-notifications';


@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {

  @Input()
  studentInfo: StudentInfo;

  feeBillsList: any[];
  tripsList: any[];
  issueTc: boolean = false;
  todays_date: String;
  cocurricularClassesList: any[];
  attendenceList: any[]

  public notification_options = {
    position: ["bottom", "right"],
    timeOut: 5000,
    lastOnBottom: true
  };

  constructor(private productDataService: ProductDataService,
    private studentService: StudentService,
    private feeBillService: FeeBillService,
    private schoolDataService: SchoolDataService,
    private _service: NotificationsService) { }

  ngOnInit() {
    this.todays_date = moment().format('Do MMM YYYY');
  }

  public getAadhaarNo(person){
    if(person.identity_information && person.identity_information[0].id_number){
      return person.identity_information[0].id_number;
    }
  }

  public issueTransfer(){
   this.feeBillService.getFeeBillListByStudent(this.studentInfo.student.student_key).then(resp =>{
     if(resp.find(x=> x.status !== 'PAID' && x.status !== 'CANCELLED')){
       this.showErrorNotification("Error","Unpaid bills are present!");
       }else{
        this.studentService.issuTC(this.studentInfo.student.student_key).then(resp => {
          this.showNotification('Success', 'TC ISSUED');
          this.issueTc = false;
        }).catch(x => {
          this.showErrorNotification("Error","Could not issue TC");
        })
     }
   })
  }

  public getMaskedAadhaarNo(person){
    let aadNo = this.getAadhaarNo(person)
    if (aadNo){
      return aadNo.replace(/\d(?=\d{4})/g, "X");
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

  getSubCasteName(code: string){
    let subcaste = this.schoolDataService.school.demographic_configuration.subcastes.find(x => x.code === code);
    if(subcaste){
      return subcaste.name;
    }
  }

  public getImageUrl() {
    if(this.studentInfo.profile_image_url){
      return this.studentInfo.profile_image_url;
    }else{
      let gender = this.studentInfo.person.gender + '';
      if (gender && gender.toLowerCase() == 'male') {
        return 'assets/images/boy.png';
      } else {
        return 'assets/images/girl.png';
      }
    }
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
