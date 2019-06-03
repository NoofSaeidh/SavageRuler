import { TestBed } from '@angular/core/testing';

import { PrimaryScreenStateService } from './primary-screen-state.service';

describe('PrimaryScreenStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrimaryScreenStateService<any> = TestBed.get(
      PrimaryScreenStateService,
    );
    expect(service).toBeTruthy();
  });
});
