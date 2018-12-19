export class Exam {
  exam_key: string;
  series_code: string;
  institution_key: string;
  name: string;
  assessment_type: string;
  max_score: number;
  subject_code: string;
  type: string;
  schedule_status: string;
  schedulable: string;
  visibility: string;
  term: string;
  date_time: string;
  from_time: string;
  to_time: string;
  class_key: string;
  division: string;
  academic_year: string;
  status: string;
  audit_logs: AuditLog[];
};

class AuditLog{
  date_time: string;
  message: string;
}