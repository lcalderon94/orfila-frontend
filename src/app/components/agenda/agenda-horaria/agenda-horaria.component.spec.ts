import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaHorariaComponent } from './agenda-horaria.component';

describe('AgendaHorariaComponent', () => {
  let component: AgendaHorariaComponent;
  let fixture: ComponentFixture<AgendaHorariaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgendaHorariaComponent]
    });
    fixture = TestBed.createComponent(AgendaHorariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
