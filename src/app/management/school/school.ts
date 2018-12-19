export class School {

    school_id: string;
    name: string;
    address: string;
    classes_available : Classes_Available;
    amenities: Amentities;
    school_information: SchoolInformation;
    affiliation: Affiliation;
    user_management: UserManagement;
    admissions : Admissions;
    demographic_configuration: Demographic_Configuration;
    classes : Class[];
    transport: Transport;
    academic_years: AcademicYear[];
    product_configuration : ProductConfiguration;
    cocurricular_classes: CocurricularClass[];
    fee_configuration: FeeConfiguration;
    region_configuration: RegionConfiguration;
    departments: Department[];
    subjects: Subject[];
    subject_types: SubjectType[];
    employee_configuration: EmployeeConfiguration;
    academic_configuration: AcademicConfiguration;
}

export class AcademicConfiguration{
  exam_configuration: ExamConfiguration;
  subject_types: SubjectType[];
  subjects: Subject[];
}

export class ExamConfiguration{
  assessment_types : AssessmentType[];
  exam_types : ExamType[];
  exam_status : ExamStatus[];
  exam_series : ExamSeries[];
}

export class SubjectType{
  code: string;
  name: string;
}

export class Subject{
  code: string;
  name: string;
}

export class EmployeeConfiguration{
  staff_type : StaffType[];
  designations : Designation[];
}

export class AssessmentType{
  name : string;
  code : string;
}

export class ExamType{
  name : string;
  code : string;
}

export class ExamStatus {
  name : string;
  code : string;
}

export class ExamSeries {
  name : string;
  code : string;
  from_date : string;
  to_date : string;
  classes: Exam_Class[];
  schedule_publish : boolean;
  results_publish: boolean;
}

export class Exam_Class {
  division: string;
  class_key: string;
}
export class StaffType{
  name : string;
  code : string;
}

export class Designation{
  name : string;
  code : string;
}

export class Department{
  name : string;
  code : string;
}

export class FeeConfiguration{
  receipt_serial_key: string;
}

export class RegionConfiguration{
  currency: string;
}

export class ProductConfiguration{
    user_roles : string[];
}

export class CocurricularClass{
  class_info_key: string;
}

export class AcademicYear{
  start_date: string;
  end_date: string;
  code: string;
  name: string;
}

export class Transport{
  routes: string[];
  trips: string[];
  vehicles: string[];
}

export class Class{
    name : string;
    code : string;
    divisions : Divisions[];
}

export class Divisions{
  name : string;
  code : string;
}

export class Demographic_Configuration{
  professions : Profession[];
  castes : Caste[];
  subcastes: Subcaste[];
  religions : Religion[];
}

export class Caste{
  code : string;
  name : string;
}

export class Subcaste{
  code : string;
  name : string;
}

export class Religion{
  code : string;
  name : string;
}

export class Profession{
  code : string;
  name : string;
}

export class Admissions{
    academic_year : string;
    application_fee : string;
    classes : Classes[];
    status : string;
}

export class Classes{
    code : string;
    seatCount : number;
}

export class UserManagement{
  user_roles: string[];
}

export class Classes_Available{
  nursery : string;
  lower_primary : string;
  preschool : string;
  high_school : string;
  upper_primary : string;
  higher_secondary : string;
}

export class Amentities {

    music_room: string;
    hostel: string;
    dance_room: string;
    indoor_games: string;
    gym: string;
    swimming_pool: string;
}

export class SchoolInformation {

    principal: string;
    website: string;
    phone: string;
    school_trust: string;
    founding_year: string;
    school_type: string;
    description: string;
    school_category: string;
    email: string;
    school_management_key: string;
}

export class Affiliation {

    number: string;
    type: string;
    board: string;
}
