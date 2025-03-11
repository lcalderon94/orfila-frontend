import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioLexnetComponent } from './envio-lexnet.component';

describe('EnvioLexnetComponent', () => {
  let component: EnvioLexnetComponent;
  let fixture: ComponentFixture<EnvioLexnetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnvioLexnetComponent]
    });
    fixture = TestBed.createComponent(EnvioLexnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
