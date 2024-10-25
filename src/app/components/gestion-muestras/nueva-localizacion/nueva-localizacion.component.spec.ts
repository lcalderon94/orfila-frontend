import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaLocalizacionComponent } from './nueva-localizacion.component';

describe('NuevaLocalizacionComponent', () => {
  let component: NuevaLocalizacionComponent;
  let fixture: ComponentFixture<NuevaLocalizacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevaLocalizacionComponent]
    });
    fixture = TestBed.createComponent(NuevaLocalizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
