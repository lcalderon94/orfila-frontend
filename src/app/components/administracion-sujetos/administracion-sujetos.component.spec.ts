import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionSujetosComponent } from './administracion-sujetos.component';

describe('AdministracionSujetosComponent', () => {
  let component: AdministracionSujetosComponent;
  let fixture: ComponentFixture<AdministracionSujetosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdministracionSujetosComponent]
    });
    fixture = TestBed.createComponent(AdministracionSujetosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
