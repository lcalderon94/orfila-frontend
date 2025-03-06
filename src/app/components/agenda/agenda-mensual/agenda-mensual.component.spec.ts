import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaMensualComponent } from './agenda-mensual.component';

describe('AgendaMensualComponent', () => {
  let component: AgendaMensualComponent;
  let fixture: ComponentFixture<AgendaMensualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgendaMensualComponent]
    });
    fixture = TestBed.createComponent(AgendaMensualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
