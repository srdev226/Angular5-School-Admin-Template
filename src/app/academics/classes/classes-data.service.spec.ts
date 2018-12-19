import { TestBed, inject } from '@angular/core/testing';

import { ClassesDataService } from './classes-data.service';

describe('ClassesDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClassesDataService]
    });
  });

  it('should be created', inject([ClassesDataService], (service: ClassesDataService) => {
    expect(service).toBeTruthy();
  }));
});
