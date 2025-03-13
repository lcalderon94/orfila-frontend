import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortafirmasDocumentosComponent } from './portafirmas-documentos.component';

describe('PortafirmasDocumentosComponent', () => {
  let component: PortafirmasDocumentosComponent;
  let fixture: ComponentFixture<PortafirmasDocumentosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortafirmasDocumentosComponent]
    });
    fixture = TestBed.createComponent(PortafirmasDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
