import { TestBed } from '@angular/core/testing';

import { LoadStateService } from './load-state.service';
import { SrTestBed } from 'src/tests/sr-test-bed';
import { Power } from 'src/app/api/entities/powers/types/power';

describe('LoadStateService', () => {
  beforeEach(async () =>
    TestBed.configureTestingModule(
      SrTestBed.defaultApiMetadata({ providers: [LoadStateService] }),
    ),
  );

  it('should be created', () => {
    const service: LoadStateService<Power> = TestBed.get(LoadStateService);
    expect(service).toBeTruthy();
  });
});
