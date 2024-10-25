import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaCodigosComponent } from './carga-codigos.component';

describe('CargaCodigosComponent', () => {
  let component: CargaCodigosComponent;
  let fixture: ComponentFixture<CargaCodigosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CargaCodigosComponent]
    });
    fixture = TestBed.createComponent(CargaCodigosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
