import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventoDialogComponent } from './evento-dialog.component';

describe('EventoDialogComponent', () => {
  let component: EventoDialogComponent;
  let fixture: ComponentFixture<EventoDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventoDialogComponent]
    });
    fixture = TestBed.createComponent(EventoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
