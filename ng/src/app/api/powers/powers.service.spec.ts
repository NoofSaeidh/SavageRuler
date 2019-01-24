import { TestBed } from '@angular/core/testing';

import { PowersService } from './powers.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PowersService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: PowersService = TestBed.get(PowersService);
    expect(service).toBeTruthy();
  });
});
