import { TestBed, inject } from '@angular/core/testing';

import { FeeBillService } from './fee-bill.service';

describe('FeeBillService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeeBillService]
    });
  });

  it('should ...', inject([FeeBillService], (service: FeeBillService) => {
    expect(service).toBeTruthy();
  }));
});
