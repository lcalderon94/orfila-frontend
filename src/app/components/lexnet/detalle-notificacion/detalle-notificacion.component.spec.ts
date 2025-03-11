import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleNotificacionComponent } from './detalle-notificacion.component';

describe('DetalleNotificacionComponent', () => {
  let component: DetalleNotificacionComponent;
  let fixture: ComponentFixture<DetalleNotificacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleNotificacionComponent]
    });
    fixture = TestBed.createComponent(DetalleNotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
