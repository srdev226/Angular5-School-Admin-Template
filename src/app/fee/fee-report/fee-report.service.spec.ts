import { TestBed, inject } from '@angular/core/testing';

import { FeeReportService } from './fee-report.service';

describe('FeeReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeeReportService]
    });
  });

  it('should be created', inject([FeeReportService], (service: FeeReportService) => {
    expect(service).toBeTruthy();
  }));
});
