import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuestraDetalleComponent } from './muestra-detalle.component';

describe('MuestraDetalleComponent', () => {
  let component: MuestraDetalleComponent;
  let fixture: ComponentFixture<MuestraDetalleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MuestraDetalleComponent]
    });
    fixture = TestBed.createComponent(MuestraDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
