import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemisionMuestrasComponent } from './remision-muestras.component';

describe('RemisionMuestrasComponent', () => {
  let component: RemisionMuestrasComponent;
  let fixture: ComponentFixture<RemisionMuestrasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemisionMuestrasComponent]
    });
    fixture = TestBed.createComponent(RemisionMuestrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
