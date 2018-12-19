import {PhoneNumber} from '../common/phone-number';

export class Student {

  student_key: string;
  full_name: string;
  gender: GenderType;
  admission_number: string;
  school_id: string;
  person_key: string;
  admission_year: string;
  current_class_key: string;
  current_class: string;
  status: string;
  division: string;
  profile_image_key: string;
  mother_person_key: string;
  father_person_key: string;
  notification_mobile_numbers: PhoneNumber[];
  transport_subscriptions: string[];
  online_access_persons: OnlineAccessPerson[];

}

export enum GenderType {
  Male,
  Female
}

export class OnlineAccessPerson{
  person_key: string;
  status: string;
}
