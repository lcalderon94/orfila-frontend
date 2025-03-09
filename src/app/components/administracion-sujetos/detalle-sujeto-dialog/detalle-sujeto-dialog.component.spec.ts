import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSujetoDialogComponent } from './detalle-sujeto-dialog.component';

describe('DetalleSujetoDialogComponent', () => {
  let component: DetalleSujetoDialogComponent;
  let fixture: ComponentFixture<DetalleSujetoDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleSujetoDialogComponent]
    });
    fixture = TestBed.createComponent(DetalleSujetoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
