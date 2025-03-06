import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoCustodiaComponent } from './paso-custodia.component';

describe('PasoCustodiaComponent', () => {
  let component: PasoCustodiaComponent;
  let fixture: ComponentFixture<PasoCustodiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasoCustodiaComponent]
    });
    fixture = TestBed.createComponent(PasoCustodiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
