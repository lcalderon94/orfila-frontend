import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActuacionesComponent } from './actuaciones.component';

describe('ActuacionesComponent', () => {
  let component: ActuacionesComponent;
  let fixture: ComponentFixture<ActuacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActuacionesComponent]
    });
    fixture = TestBed.createComponent(ActuacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
