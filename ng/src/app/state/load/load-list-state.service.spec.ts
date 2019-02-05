import { TestBed } from '@angular/core/testing';

import { LoadListStateService } from './load-list-state.service';

describe('LoadListStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadListStateService = TestBed.get(LoadListStateService);
    expect(service).toBeTruthy();
  });
});
