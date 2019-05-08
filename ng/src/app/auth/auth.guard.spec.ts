import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { SrTestBed } from 'src/tests/sr-test-bed';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(SrTestBed.defaultApiMetadata());
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
