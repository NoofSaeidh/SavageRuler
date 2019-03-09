import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiDescriptor } from '../types/api-descriptor';
import { ApiCrudService } from './api-crud.service';
import { SrTestBed } from 'src/tests/sr-test-bed';
import { Power } from '../entities/powers/types/power';

describe('ApiCrudService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule(SrTestBed.defaultApiMetadata()),
  );

  it('should be created', () => {
    const service: ApiCrudService<Power, number> = TestBed.get(ApiCrudService);
    expect(service).toBeTruthy();
  });
});
