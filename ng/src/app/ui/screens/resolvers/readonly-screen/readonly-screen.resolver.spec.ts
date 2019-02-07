import { TestBed } from '@angular/core/testing';

import { ReadonlyScreenResolver} from './readonly-screen.resolver';

describe('ReadonlyScreenResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReadonlyScreenResolver = TestBed.get(ReadonlyScreenResolver);
    expect(service).toBeTruthy();
  });
});
