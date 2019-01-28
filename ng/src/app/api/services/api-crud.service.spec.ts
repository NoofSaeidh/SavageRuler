import { TestBed } from '@angular/core/testing';

import { ApiCrudService } from './api-crud.service';

describe('ApiCrudService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiCrudService<any> = TestBed.get(ApiCrudService);
    expect(service).toBeTruthy();
  });
});
