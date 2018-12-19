import { TestBed, inject } from '@angular/core/testing';

import { FeeReportHttpClient } from './fee-report-http-client';

describe('FeeReportHttpClient', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeeReportHttpClient]
    });
  });

  it('should be created', inject([FeeReportHttpClient], (service: FeeReportHttpClient) => {
    expect(service).toBeTruthy();
  }));
});
