import { TestBed, inject } from '@angular/core/testing';

import { UserRoleDataService } from './user-role-data.service';

describe('UserRoleDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserRoleDataService]
    });
  });

  it('should be created', inject([UserRoleDataService], (service: UserRoleDataService) => {
    expect(service).toBeTruthy();
  }));
});
