import { School } from '../management/school/school';
import { PersonInfo } from '../person/person';
import { PhoneNumber } from '../common/phone-number';

export class AdmissionApplication {

  applicationData: ApplicationData = new ApplicationData();

	school: School;
  child: PersonInfo;
	father: PersonInfo;
	mother: PersonInfo;
	guardians: PersonInfo[];
	status: string;

}

export class ApplicationData{
	application_key: string;
	user_account_key: string;
	school_id: string;
  student_key: string;
	admission_year: string;
	class_applied: string;
	candidate_personal_id: string;
  date_of_application: string;
  mother_person_key: string;
  father_person_key: string;
  guardian_person_keys: string[];
  mobile_numbers: PhoneNumber[];
  audit_logs: AuditLog[];
  notes: Note[];
  status: string;
  payment_status: string;
  payments: string[];
  additional_information : AdditionalInfo;
}

export class AdditionalInfo{
  candidate : Candidate;
  parent_professions : string[];
  family_income : string;
}

export class Candidate{
  full_name : string;
  gender : string;
  religion : string;
  caste : string;
  profile_image_key:string;
  profile_image_url: string;
}

export class AuditLog {
  log_date: string;
  user_name: string;
	message: string;
}

export class Note {
  entry_date: string;
  user_name: string;
	message: string;
}
