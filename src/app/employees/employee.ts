import { PhoneNumber} from '../common/phone-number';

export class Employee {
  employee_key: string;
  emp_code: string;
  institution_key: string;
  type_code: string;
  dep_code: string;
  designation_code: string;
  qualification: string;
  person_key: string;
  full_name: string;
  gender: string;
  profile_image_key: string;
  partner_key: string;
  notification_mobile_numbers: PhoneNumber[] = [];
  teacher: Teacher;
}

export class Teacher{
  subjects: Subject[] = [];
  classes: ClassInfo[] = [];
}

export class ClassInfo{
  class_key: string;
}

export class Subject{
  code: string;
}
