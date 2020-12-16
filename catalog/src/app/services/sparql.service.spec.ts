import { TestBed } from '@angular/core/testing';

import { SparqlService } from './sparql.service';

describe('SparqlService', () => {
  let service: SparqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SparqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
