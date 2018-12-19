import { TestBed, inject } from '@angular/core/testing';

import { StudentDataService } from './student-data.service';

describe('StudentDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentDataService]
    });
  });

  it('should be created', inject([StudentDataService], (service: StudentDataService) => {
    expect(service).toBeTruthy();
  }));
});
