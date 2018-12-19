import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User} from '../user';
import { UserAccount} from '../../user-account/user-account';
import { PersonInfo} from '../../person/person';

import { UserAccountService} from '../../user-account/user-account.service';
import { PersonService} from '../../person/person.service';
import { SchoolDataService } from '../../management/school/school-data.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userList: UserAccount[] = [];
  users : User[] = [];

  constructor(private router: Router,
              private schoolDataService: SchoolDataService,
              private userService: UserAccountService,
              private personService: PersonService
            ) { }

  ngOnInit() {
    this.getUserList();
  }

  getUserList(){
    let institutionKey = this.schoolDataService.getSchool().school_id;
    this.userService.getUserList(institutionKey).then(resp=>{
      this.userList = resp;

      for(let useraccount of resp){
        let user = new User();
        user.accountKey = useraccount.user_account_key;
        if(useraccount.person_key!==undefined && useraccount.person_key!== null){
          this.personService.getPerson(useraccount.person_key).then(resp=>{
            user.full_name = resp.full_name;
          });
          user.institutionKey = this.schoolDataService.getSchool().school_id;
          this.users.push(user);
        }
      }
    })
  }

  goToEditUser(accountKey){
    this.router.navigate(['user/edit',accountKey]);
  }
  gotoAddUser() {
    this.router.navigate(['user/add']);
  }
}
