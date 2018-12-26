import { School, Class, Divisions, AcademicYear, ExamConfiguration, ExamSeries } from '../../../management/school/school';
import { ClassInfo } from '../../classes/class-info';

export class ReportCardConfiguration {
  academic_year: string;
  classes: SelectedClassInfo[];
  grade_rules: GrageRule[];
  mark_distribution: MarkDistribution[]; 
}

export class SelectedClassInfo {
  is_selected: boolean;
  class_info: ClassInfo;
}

export class GrageRule {
  percentage_from: number;
  percentage_to: number;
  letter_grade: string;
}

export class MarkDistribution {
  exam: ExamSeries;
  percentage_weightage: number;
}
