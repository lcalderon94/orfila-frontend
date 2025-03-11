import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarDocumentoEpisodioComponent } from './agregar-documento-episodio.component';

describe('AgregarDocumentoEpisodioComponent', () => {
  let component: AgregarDocumentoEpisodioComponent;
  let fixture: ComponentFixture<AgregarDocumentoEpisodioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgregarDocumentoEpisodioComponent]
    });
    fixture = TestBed.createComponent(AgregarDocumentoEpisodioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
