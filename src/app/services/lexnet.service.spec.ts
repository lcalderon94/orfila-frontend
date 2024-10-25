import { TestBed } from '@angular/core/testing';

import { LexnetService } from './lexnet.service';

describe('LexnetService', () => {
  let service: LexnetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LexnetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
