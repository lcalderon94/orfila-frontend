import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaSemanalComponent } from './agenda-semanal.component';

describe('AgendaSemanalComponent', () => {
  let component: AgendaSemanalComponent;
  let fixture: ComponentFixture<AgendaSemanalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgendaSemanalComponent]
    });
    fixture = TestBed.createComponent(AgendaSemanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
