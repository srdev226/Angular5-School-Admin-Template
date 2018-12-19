import { Injectable } from '@angular/core';

import { UserAccount} from '../user-account/user-account';
import { PersonInfo} from '../person/person';

@Injectable()
export class UserAccountDataService {

  user_account : UserAccount = new UserAccount();
  person_details : PersonInfo = new PersonInfo();

  constructor() { }

  setUserAccount(user_account:UserAccount){
    this.user_account = user_account;
  }

  getUserAccount(): UserAccount{
    return this.user_account;
  }

  setPersonDetails(person :PersonInfo){
    this.person_details = person;
  }

  getPersonDetails(): PersonInfo{
    return this.person_details;
  }
}
