import { TestBed } from '@angular/core/testing';

import { EventModalService } from './event-modal.service';

describe('EventModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventModalService = TestBed.get(EventModalService);
    expect(service).toBeTruthy();
  });
});
