import { TestBed, inject } from '@angular/core/testing';

import { TripLogsService } from './trip-logs.service';

describe('TripLogsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TripLogsService]
    });
  });

  it('should be created', inject([TripLogsService], (service: TripLogsService) => {
    expect(service).toBeTruthy();
  }));
});
