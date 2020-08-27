import { TestBed } from '@angular/core/testing';

import { IdentifierGuard } from './identifier.guard';

describe('IdentifierGuard', () => {
  let guard: IdentifierGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IdentifierGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
