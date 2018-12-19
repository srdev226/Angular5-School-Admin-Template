import { Employee } from '../employee';
import { PersonInfo } from '../../person/person';

export class EmployeeInfo {
  employee: Employee = new Employee();
  person: PersonInfo = new PersonInfo();
  profile_image_url: string;
}
