import { TestBed } from '@angular/core/testing';

import { MuestrasService } from './muestras.service'; 

describe('MuestraService', () => {
  let service: MuestrasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MuestrasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
