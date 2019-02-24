import { TestBed } from '@angular/core/testing';

import { ApiTokenAuthService } from './api-token-auth.service';

describe('ApiAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiTokenAuthService = TestBed.get(ApiTokenAuthService);
    expect(service).toBeTruthy();
  });
});
