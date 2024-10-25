import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargasSistemaComponent } from './cargas-sistema.component';

describe('CargasSistemaComponent', () => {
  let component: CargasSistemaComponent;
  let fixture: ComponentFixture<CargasSistemaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CargasSistemaComponent]
    });
    fixture = TestBed.createComponent(CargasSistemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
