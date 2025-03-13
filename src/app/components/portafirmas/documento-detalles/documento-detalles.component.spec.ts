import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoDetallesComponent } from './documento-detalles.component';

describe('DocumentoDetallesComponent', () => {
  let component: DocumentoDetallesComponent;
  let fixture: ComponentFixture<DocumentoDetallesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentoDetallesComponent]
    });
    fixture = TestBed.createComponent(DocumentoDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
