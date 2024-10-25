import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMuestrasComponent } from './gestion-muestras.component';

describe('GestionMuestrasComponent', () => {
  let component: GestionMuestrasComponent;
  let fixture: ComponentFixture<GestionMuestrasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionMuestrasComponent]
    });
    fixture = TestBed.createComponent(GestionMuestrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
