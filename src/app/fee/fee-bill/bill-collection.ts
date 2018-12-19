import { Student } from '../../student/student';

export class BillCollection {

  month: string;
  year: number;
  bills_amount_due: number = 0;
  bills_amount_collected: number = 0;
  bills_amount_total = 0;
  overdue_bills_count: number = 0;
  overdue_students_list: Student[] = [];

}
