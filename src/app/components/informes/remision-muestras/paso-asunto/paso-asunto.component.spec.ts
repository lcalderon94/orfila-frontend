import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoAsuntoComponent } from './paso-asunto.component';

describe('PasoAsuntoComponent', () => {
  let component: PasoAsuntoComponent;
  let fixture: ComponentFixture<PasoAsuntoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasoAsuntoComponent]
    });
    fixture = TestBed.createComponent(PasoAsuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
