import { TestBed } from '@angular/core/testing';

import { LoadStateService } from './load-state.service';

describe('LoadStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadStateService = TestBed.get(LoadStateService);
    expect(service).toBeTruthy();
  });
});
