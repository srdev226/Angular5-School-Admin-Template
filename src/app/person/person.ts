export class Person {

  constructor() { this.person_info = new PersonInfo(); }
  relation: string;
  person_info: PersonInfo;

  educationLevels: EducationLevel[] = [
    {"code" : "HS", "desc" : "Higher Secondary"},
    {"code" : "SS", "desc" : "Senior Secondary"},
    {"code" : "UG", "desc" : "Under Graduate"},
    {"code" : "MS", "desc" : "Masters"},
    {"code" : "PHD", "desc" : "PhD"}
  ]
}

export enum GenderType {
  Male,
  Female
}

export class PersonInfo {
  profile_image_key: string;
  profile_image_url: string;
  person_key: string;
  full_name: string;
  gender: GenderType;
  dob: Date;
  addresses: Address[] = [];
  phone_numbers: PhoneNumber[] = [];
  email_addresses: Email[] = [];
  education: Education;
  profession: Profession;
  religion: string;
  caste: string;
  subcaste: string;
  identity_information: IdentityInformation[];
  immediate_contact: ImmediateContact;
  marital_status: string;
  blood_group: string;
}

export class ImmediateContact{
  full_name: string;
  phone_numbers: PhoneNumber[] = [];
}

export class IdentityInformation{
  type: string;
  name_on_id: string;
  id_number: string;
  is_verified: boolean;
}

export class Address {

  address_type: string;
  address_line1: string;
  address_line2: string;
  pincode: number;
  state: string;
  country: string;
}

export class PhoneNumber {

  phone_type: string;
  isd_code: string;
  std_code: string;
  phone_number: string;
}

export class Email {

  email_type: string;
  email_id: string;
}

export class Education { level: string; }

export class Profession {

  profession_name: string;
  annual_income: string;
}

export class EducationLevel {
  code: string;
  desc: string;
}

export class NotificationDetails{
  notification_number: string;
  person_key: string;
  name: string;
}
