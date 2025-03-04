import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HojaEvolucionComponent } from './hoja-evolucion.component';

describe('HojaEvolucionComponent', () => {
  let component: HojaEvolucionComponent;
  let fixture: ComponentFixture<HojaEvolucionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HojaEvolucionComponent]
    });
    fixture = TestBed.createComponent(HojaEvolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
