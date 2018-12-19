import { TestBed, inject } from '@angular/core/testing';

import { UserAccountDataService } from './user-account-data.service';

describe('UserAccountDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserAccountDataService]
    });
  });

  it('should be created', inject([UserAccountDataService], (service: UserAccountDataService) => {
    expect(service).toBeTruthy();
  }));
});
