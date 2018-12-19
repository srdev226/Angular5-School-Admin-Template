import { Student } from '../student';
import { PersonInfo } from '../../person/person';

export class StudentInfo {

  student: Student = new Student();
  person: PersonInfo = new PersonInfo();
  profile_image_url: string;
  mother: PersonInfo = new PersonInfo();
  father: PersonInfo = new PersonInfo();

}
