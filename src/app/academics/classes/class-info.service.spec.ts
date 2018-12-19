import { TestBed, inject } from '@angular/core/testing';

import { ClassInfoService } from './class-info.service';

describe('ClassInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClassInfoService]
    });
  });

  it('should be created', inject([ClassInfoService], (service: ClassInfoService) => {
    expect(service).toBeTruthy();
  }));
});
