import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleEscritoComponent } from './detalle-escrito.component';

describe('DetalleEscritoComponent', () => {
  let component: DetalleEscritoComponent;
  let fixture: ComponentFixture<DetalleEscritoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleEscritoComponent]
    });
    fixture = TestBed.createComponent(DetalleEscritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
