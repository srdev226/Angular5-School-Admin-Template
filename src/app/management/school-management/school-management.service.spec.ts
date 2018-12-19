import { TestBed, inject } from '@angular/core/testing';

import { SchoolManagementService } from './school-management.service';

describe('SchoolManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SchoolManagementService]
    });
  });

  it('should be created', inject([SchoolManagementService], (service: SchoolManagementService) => {
    expect(service).toBeTruthy();
  }));
});
