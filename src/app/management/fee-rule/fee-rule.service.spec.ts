import { TestBed, inject } from '@angular/core/testing';

import { FeeRuleService } from './fee-rule.service';

describe('FeeRuleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeeRuleService]
    });
  });

  it('should ...', inject([FeeRuleService], (service: FeeRuleService) => {
    expect(service).toBeTruthy();
  }));
});
