import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoSujetosComponent } from './paso-sujetos.component';

describe('PasoSujetosComponent', () => {
  let component: PasoSujetosComponent;
  let fixture: ComponentFixture<PasoSujetosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasoSujetosComponent]
    });
    fixture = TestBed.createComponent(PasoSujetosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
