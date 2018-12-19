
export class SchoolStudentData {

  total_boys_count: number = 0;
  total_girls_count: number = 0;
  class_student_data: ClassStudentData[] = [];

  total_students_count(){
    return this.total_boys_count + this.total_girls_count;
  }

}

export class ClassStudentData{
  class_name: string;
  division_name: string;
  boys_count: number = 0;
  girls_count: number = 0;

  students_count(){
    return this.boys_count + this.girls_count;
  }
}
