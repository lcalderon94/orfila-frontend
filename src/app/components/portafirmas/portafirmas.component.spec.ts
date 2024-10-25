import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortafirmasComponent } from './portafirmas.component';

describe('PortafirmasComponent', () => {
  let component: PortafirmasComponent;
  let fixture: ComponentFixture<PortafirmasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortafirmasComponent]
    });
    fixture = TestBed.createComponent(PortafirmasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
