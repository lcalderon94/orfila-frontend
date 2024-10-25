import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaDocumentosComponent } from './consulta-documentos.component';

describe('ConsultaDocumentosComponent', () => {
  let component: ConsultaDocumentosComponent;
  let fixture: ComponentFixture<ConsultaDocumentosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultaDocumentosComponent]
    });
    fixture = TestBed.createComponent(ConsultaDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
