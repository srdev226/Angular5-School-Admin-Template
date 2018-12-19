import { AuditLog } from '../../common/audit-log';

export class Attendance{
  school_key: string;
  student_key: string;
  attendance_date: string;
  class_key: string;
  division: string;
  reason: string;
  audit_logs: AuditLog[];
}
