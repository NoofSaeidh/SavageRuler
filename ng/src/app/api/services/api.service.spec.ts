import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { Power } from 'src/app/api/entities/powers/descriptors/power';

describe('ApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiService = TestBed.get(ApiService);
    expect(service).toBeTruthy();
  });
});
