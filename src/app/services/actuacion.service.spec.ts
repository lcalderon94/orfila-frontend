import { TestBed } from '@angular/core/testing';

import { ActuacionService } from './actuacion.service';

describe('ActuacionService', () => {
  let service: ActuacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActuacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
