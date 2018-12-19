import { TestBed, inject } from '@angular/core/testing';

import { StudentFilterDataService } from './student-filter-data.service';

describe('StudentFilterDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentFilterDataService]
    });
  });

  it('should be created', inject([StudentFilterDataService], (service: StudentFilterDataService) => {
    expect(service).toBeTruthy();
  }));
});
