import { TestBed } from '@angular/core/testing';

import { ApiCrudService } from './api-crud.service';
import { Power } from 'src/app/views/powers/types/power';

describe('ApiCrudService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiCrudService<Power, number> = TestBed.get(ApiCrudService);
    expect(service).toBeTruthy();
  });
});
