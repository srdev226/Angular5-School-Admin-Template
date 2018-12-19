export class StudentFilter {

  search_string: string;
  search_string_elements: SearchStringElement[] = [];

  full_name: string;
  admission_number: string;
  class: string;
  classes: string[] = [];
  gender: GenderType;
  status: string;
  divisions: string[] = [];
}

export class SearchStringElement{
  code: string;
  value: string;
}

export enum GenderType {
  Male,
  Female
}
