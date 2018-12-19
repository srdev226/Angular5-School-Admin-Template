import { Injectable } from '@angular/core';

import { ExamFilter } from './exam-list/exam-list.component';

@Injectable()
export class ExamDataService {

  private exam_filter: ExamFilter;

  constructor() { }

  setExamFilterData(exam_filter: ExamFilter){
    this.exam_filter = exam_filter;
  }

  getExamFilterData(): ExamFilter{
    return this.exam_filter;
  }

}
