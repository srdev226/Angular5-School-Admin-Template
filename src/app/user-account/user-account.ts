export class UserAccount {

  user_account_key: string;
  person_key: string;
  parents: Parent[];
  children: Child[];
  applications: Application[];
  school_key: string;
  user_role_keys: string[];
}

export class Parent {
  person_key: string;

  constructor(person_key: string) { this.person_key = person_key; }
}

export class Child {
  person_key: string;
  mother_person_key: string;
  father_person_key: string;
  guardians: Guardian[];
  enrollments: Enrollment[];

  constructor(person_key: string, mother_person_key: string,
              father_person_key: string, guardians : Guardian[]){
    this.person_key = person_key;
    this.mother_person_key = mother_person_key;
    this.father_person_key = father_person_key;
    this.guardians = guardians;
  }
}

export class Enrollment{
  school_key: string;
  student_key: string;
  is_active: boolean;
}

export class Guardian {
  person_key: string;
  relationship: string;

  constructor(person_key: string, relationship: string) {
    this.person_key = person_key;
    this.relationship = relationship;
  }
}

export class Application {

  application_key: string;

  constructor(application_key: string){
    this.application_key = application_key;
  }
}
