import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareaDetalleComponent } from './tarea-detalle.component';

describe('TareaDetalleComponent', () => {
  let component: TareaDetalleComponent;
  let fixture: ComponentFixture<TareaDetalleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TareaDetalleComponent]
    });
    fixture = TestBed.createComponent(TareaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
