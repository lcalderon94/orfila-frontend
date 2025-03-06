import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoMuestrasComponent } from './paso-muestras.component';

describe('PasoMuestrasComponent', () => {
  let component: PasoMuestrasComponent;
  let fixture: ComponentFixture<PasoMuestrasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasoMuestrasComponent]
    });
    fixture = TestBed.createComponent(PasoMuestrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
