import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PowersApiService } from './powers.api.service';
import { ApiDescriptor } from '../../types/api-descriptor';
import { powerApiDescriptor, POWER_API_DESCRIPTOR } from './descriptors/power-api-descriptor';
import { HttpClient } from '@angular/common/http';

describe('PowersApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      {provide: POWER_API_DESCRIPTOR, useValue: powerApiDescriptor}
    ]
  }));

  it('should be created', () => {
    const service: PowersApiService = TestBed.get(PowersApiService);
    expect(service).toBeTruthy();
  });
});
