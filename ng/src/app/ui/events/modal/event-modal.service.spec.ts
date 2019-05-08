import { TestBed } from '@angular/core/testing';

import { EventModalService } from './event-modal.service';
import { SrTestBed } from 'src/tests/sr-test-bed';

describe('EventModalService', () => {
  beforeEach(() => TestBed.configureTestingModule(SrTestBed.defaultUiComponentsMetadata()));

  it('should be created', () => {
    const service: EventModalService = TestBed.get(EventModalService);
    expect(service).toBeTruthy();
  });
});
