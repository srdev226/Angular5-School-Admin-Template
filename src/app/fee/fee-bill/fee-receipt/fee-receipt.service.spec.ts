import { TestBed, inject } from '@angular/core/testing';

import { FeeReceiptService } from './fee-receipt.service';

describe('FeeReceiptService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeeReceiptService]
    });
  });

  it('should be created', inject([FeeReceiptService], (service: FeeReceiptService) => {
    expect(service).toBeTruthy();
  }));
});
