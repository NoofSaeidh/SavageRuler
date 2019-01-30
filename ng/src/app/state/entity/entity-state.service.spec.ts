import { TestBed } from '@angular/core/testing';

import { EntityStateService } from './entity-state.service';

describe('EntityStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EntityStateService<any> = TestBed.get(EntityStateService);
    expect(service).toBeTruthy();
  });
});
