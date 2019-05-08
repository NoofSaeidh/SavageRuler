import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PowersApiService } from './powers.api.service';
import { ApiDescriptor } from '../../types/api-descriptor';
import { HttpClient } from '@angular/common/http';

describe('PowersApiService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    }),
  );

  it('should be created', () => {
    const service: PowersApiService = TestBed.get(PowersApiService);
    expect(service).toBeTruthy();
  });
});
