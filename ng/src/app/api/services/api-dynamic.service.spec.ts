import { TestBed } from '@angular/core/testing';

import { ApiDynamicService } from './api-dynamic.service';
import { SrTestBed } from 'src/tests/sr-test-bed';

describe('ApiDynamicService', () => {
  beforeEach(() => TestBed.configureTestingModule(SrTestBed.defaultApiMetadata()));

  it('should be created', () => {
    const service: ApiDynamicService = TestBed.get(ApiDynamicService);
    expect(service).toBeTruthy();
  });
});
