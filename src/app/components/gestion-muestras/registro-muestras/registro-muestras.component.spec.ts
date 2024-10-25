import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroMuestrasComponent } from './registro-muestras.component';

describe('RegistroMuestrasComponent', () => {
  let component: RegistroMuestrasComponent;
  let fixture: ComponentFixture<RegistroMuestrasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroMuestrasComponent]
    });
    fixture = TestBed.createComponent(RegistroMuestrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
