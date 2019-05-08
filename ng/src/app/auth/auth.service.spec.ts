import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { SrTestBed } from 'src/tests/sr-test-bed';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule(SrTestBed.defaultApiMetadata()));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
