import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoBasicosComponent } from './paso-basicos.component';

describe('PasoBasicosComponent', () => {
  let component: PasoBasicosComponent;
  let fixture: ComponentFixture<PasoBasicosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasoBasicosComponent]
    });
    fixture = TestBed.createComponent(PasoBasicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
