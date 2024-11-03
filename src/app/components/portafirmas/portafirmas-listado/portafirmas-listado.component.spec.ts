import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortafirmasListadoComponent } from './portafirmas-listado.component';

describe('PortafirmasListadoComponent', () => {
  let component: PortafirmasListadoComponent;
  let fixture: ComponentFixture<PortafirmasListadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortafirmasListadoComponent]
    });
    fixture = TestBed.createComponent(PortafirmasListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
