import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoEnviosComponent } from './estado-envios.component';

describe('EstadoEnviosComponent', () => {
  let component: EstadoEnviosComponent;
  let fixture: ComponentFixture<EstadoEnviosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstadoEnviosComponent]
    });
    fixture = TestBed.createComponent(EstadoEnviosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
