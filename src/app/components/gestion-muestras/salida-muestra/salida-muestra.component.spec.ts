import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalidaMuestraComponent } from './salida-muestra.component';

describe('SalidaMuestraComponent', () => {
  let component: SalidaMuestraComponent;
  let fixture: ComponentFixture<SalidaMuestraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalidaMuestraComponent]
    });
    fixture = TestBed.createComponent(SalidaMuestraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
