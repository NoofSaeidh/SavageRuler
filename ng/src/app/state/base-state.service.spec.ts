import { TestBed } from '@angular/core/testing';

import { BaseStateService } from './base-state.service';

describe('BaseStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseStateService = TestBed.get(BaseStateService);
    expect(service).toBeTruthy();
  });
});
