import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaAntecedentesComponent } from './consulta-antecedentes.component';

describe('ConsultaAntecedentesComponent', () => {
  let component: ConsultaAntecedentesComponent;
  let fixture: ComponentFixture<ConsultaAntecedentesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultaAntecedentesComponent]
    });
    fixture = TestBed.createComponent(ConsultaAntecedentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
