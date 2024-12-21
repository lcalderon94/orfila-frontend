import { TestBed } from '@angular/core/testing';

import { EpisodiosService } from './episodio.service';  // Cambiado a EpisodiosService

describe('EpisodiosService', () => {  // Cambiado a EpisodiosService
  let service: EpisodiosService;  // Cambiado a EpisodiosService

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpisodiosService);  // Cambiado a EpisodiosService
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});