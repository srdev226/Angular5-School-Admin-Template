import { TestBed, inject } from '@angular/core/testing';

import { UserRoleService } from './user-role.service';

describe('UserRoleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserRoleService]
    });
  });

  it('should be created', inject([UserRoleService], (service: UserRoleService) => {
    expect(service).toBeTruthy();
  }));
});
