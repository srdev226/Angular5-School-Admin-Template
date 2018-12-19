import { TestBed, inject } from '@angular/core/testing';

import { ExamDataService } from './exam-data.service';

describe('ExamDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExamDataService]
    });
  });

  it('should be created', inject([ExamDataService], (service: ExamDataService) => {
    expect(service).toBeTruthy();
  }));
});
