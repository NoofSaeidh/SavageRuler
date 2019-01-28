import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { Power } from 'src/app/types/api/power';

describe('ApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiService<Power, number> = TestBed.get(ApiService);
    expect(service).toBeTruthy();
  });
});
