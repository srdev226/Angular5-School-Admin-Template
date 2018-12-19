import { TestBed, inject } from '@angular/core/testing';

import { StudentScoreService } from './student-score.service';

describe('StudentScoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentScoreService]
    });
  });

  it('should be created', inject([StudentScoreService], (service: StudentScoreService) => {
    expect(service).toBeTruthy();
  }));
});
