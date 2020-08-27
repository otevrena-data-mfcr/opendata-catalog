import { TestBed } from '@angular/core/testing';

import { IriGuard } from './iri.guard';

describe('IriGuard', () => {
  let guard: IriGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IriGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
