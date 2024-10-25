import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LexnetComponent } from './lexnet.component';

describe('LexnetComponent', () => {
  let component: LexnetComponent;
  let fixture: ComponentFixture<LexnetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LexnetComponent]
    });
    fixture = TestBed.createComponent(LexnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
