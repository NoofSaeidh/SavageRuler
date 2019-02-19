import { TestBed } from '@angular/core/testing';

import { ApiDynamicService } from './api-dynamic.service';

describe('ApiDynamicService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiDynamicService = TestBed.get(ApiDynamicService);
    expect(service).toBeTruthy();
  });
});
