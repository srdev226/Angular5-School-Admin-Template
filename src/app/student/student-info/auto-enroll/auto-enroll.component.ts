import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from '../../../login/login.service';
import { LoginDetails } from '../../../login/login-details';
import { UserAccountService} from '../../../user-account/user-account.service';
import { UserAccount, Child, Parent, Enrollment } from '../../../user-account/user-account';
import { Student, OnlineAccessPerson } from '../../student';
import { StudentService } from '../../student.service';
import { PersonInfo } from '../../../person/person';
import { SchoolDataService } from '../../../management/school/school-data.service';
import { NotificationsService } from 'angular2-notifications';


@Component({
  selector: 'app-auto-enroll',
  templateUrl: './auto-enroll.component.html',
  styleUrls: ['./auto-enroll.component.css']
})
export class AutoEnrollComponent implements OnInit {
  @Input()
  student: Student

  @Input()
  person: PersonInfo;

  public notification_options = {
    position: ["bottom", "right"],
    timeOut: 5000,
    lastOnBottom: true
  };

  constructor(private loginService: LoginService,
              private userAccountService: UserAccountService,
              private schoolDataService: SchoolDataService,
              private studentService: StudentService,
              private _service: NotificationsService) { }

  ngOnInit() {
    console.log('[AutoEnrollComponent] ', this.student.full_name, this.person.person_key)
  }

  enableOnlineAccess(){
    let mobile_number = this.getMobilePhoneNumber(this.person);
    if(mobile_number){
      this.loginService.checkUsernameExistsInUserApp(mobile_number).then(resp => {
        if(resp){
          console.log('[AutoEnrollComponent] username not present. Proceesing to create account', mobile_number);
          this.userAccountService.addUserAccount(this.getNewAccount()).then( resp => {
            console.log('[AutoEnrollComponent] UserAccount created');
            let login_details = new LoginDetails();
            login_details.username = mobile_number;
            login_details.password = '';
            this.loginService.registerAppUser(resp.user_account_key, login_details).then(resp => {
              console.log('[AutoEnrollComponent] Login account created');
              this.setOnlineAccessPerson(this.student);
              this.studentService.updateStudent(this.student).then(resp => {
                console.log('[AutoEnrollComponent] student updated with online access info');
                this.showNotification("Success", this.person.full_name + " Enrolled for online access");
              }).catch( resp => {
                this.handleError('Updating student failed with error');
              })
            }).catch(resp => {
              this.handleError('Creating LoginAccount failed with error');
            })
          }).catch( resp => {
            this.handleError('Creating new account failed with error');
          });
        }else{
          console.log('[AutoEnrollComponent] username already exists');
        }
      }).catch( resp => {
        this.handleError("Username check fails with error")
      })
    }else{
      console.log('[AutoEnrollComponent] No mobile number. Can not enroll');// Replace with notification
      this.showWarningNotification("Can not enroll","Please add a mobile number");
    }
  }

  public isEnrolled(){
    if( this.student.online_access_persons &&
        this.student.online_access_persons.find( x => x.person_key === this.person.person_key)){
        return true;
    }else{
      return false;
    }
  }

  private setOnlineAccessPerson(student: Student){
    if(! student.online_access_persons){
      student.online_access_persons=[]
    }
    let person = new OnlineAccessPerson();
    person.person_key = this.person.person_key;
    person.status = 'ACTIVE';
    student.online_access_persons.push(person);
  }

  private getNewAccount(){
    let user_account = new UserAccount();
    user_account.person_key = this.person.person_key;
    user_account.children = [];
    let child = new Child(this.student.person_key,
                          this.student.mother_person_key,
                          this.student.father_person_key,
                          []);
    let enrollment = new Enrollment();
    enrollment.is_active = true;
    enrollment.school_key = this.schoolDataService.getSchool().school_id;
    enrollment.student_key = this.student.student_key;
    child.enrollments = [];
    child.enrollments.push(enrollment);
    user_account.children.push(child);

    user_account.parents = [];
    if(this.student.mother_person_key){
      let mom = new Parent(this.student.mother_person_key);
      user_account.parents.push(mom);
    }
    if(this.student.father_person_key){
      let dad = new Parent(this.student.father_person_key);
      user_account.parents.push(dad);
    }
    return user_account;
  }

  private handleError(msg){
    console.log('[AutoEnrollComponent] ERROR ', msg);
    this.showErrorNotification("Error","Enrolling of user failed");
  }

  private getMobilePhoneNumber(person: PersonInfo){
    if(person.phone_numbers){
      let ph_no = person.phone_numbers.find( x=> x.phone_type === 'MOBILE')
      if(ph_no){
        return ph_no.phone_number;
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

  private showWarningNotification(msg_type, message){
    const toast = this._service.warn(msg_type, message, {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

}
