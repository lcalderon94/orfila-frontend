import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoEstudiosComponent } from './paso-estudios.component';

describe('PasoEstudiosComponent', () => {
  let component: PasoEstudiosComponent;
  let fixture: ComponentFixture<PasoEstudiosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasoEstudiosComponent]
    });
    fixture = TestBed.createComponent(PasoEstudiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
