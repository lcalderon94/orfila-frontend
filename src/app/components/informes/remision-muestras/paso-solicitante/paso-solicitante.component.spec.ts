import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoSolicitanteComponent } from './paso-solicitante.component';

describe('PasoSolicitanteComponent', () => {
  let component: PasoSolicitanteComponent;
  let fixture: ComponentFixture<PasoSolicitanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasoSolicitanteComponent]
    });
    fixture = TestBed.createComponent(PasoSolicitanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
