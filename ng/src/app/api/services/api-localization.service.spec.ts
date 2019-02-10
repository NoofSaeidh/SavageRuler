import { TestBed } from '@angular/core/testing';

import { ApiLocalizationService } from './api-localization.service';
import { SrTestBed } from 'src/tests/sr-test-bed';
import { ApiDescriptor } from '../types/api-descriptor';
import { apiLocalizationDescriptor } from '../types/api-localization-descriptor';

describe('ApiLocalizationService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule(
      SrTestBed.defaultApiMetadata({
        providers: [
          { provide: ApiDescriptor, useValue: apiLocalizationDescriptor },
        ],
      }),
    ),
  );

  it('should be created', () => {
    const service: ApiLocalizationService = TestBed.get(ApiLocalizationService);
    expect(service).toBeTruthy();
  });
});
