import { TestBed } from '@angular/core/testing';

import { LocalizationService } from './localization.service';
import { SrTestBed } from 'src/tests/sr-test-bed';

describe('LocalizationService', () => {
  beforeEach(() => TestBed.configureTestingModule(SrTestBed.defaultApiMetadata()));

  it('should be created', () => {
    const service: LocalizationService = TestBed.get(LocalizationService);
    expect(service).toBeTruthy();
  });
});
