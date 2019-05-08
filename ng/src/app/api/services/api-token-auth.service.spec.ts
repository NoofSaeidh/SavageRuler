import { TestBed } from '@angular/core/testing';

import { ApiTokenAuthService } from './api-token-auth.service';
import { SrTestBed } from 'src/tests/sr-test-bed';

describe('ApiTokenAuth', () => {
  beforeEach(() => TestBed.configureTestingModule(SrTestBed.defaultApiMetadata()));

  it('should be created', () => {
    const service: ApiTokenAuthService = TestBed.get(ApiTokenAuthService);
    expect(service).toBeTruthy();
  });
});
