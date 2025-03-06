import { TestBed } from '@angular/core/testing';

import { RemisionMuestrasService } from './remision-muestras.service';

describe('RemisionMuestrasService', () => {
  let service: RemisionMuestrasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemisionMuestrasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
