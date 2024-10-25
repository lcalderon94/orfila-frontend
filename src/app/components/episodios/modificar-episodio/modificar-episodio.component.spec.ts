import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarEpisodioComponent } from './modificar-episodio.component';

describe('ModificarEpisodioComponent', () => {
  let component: ModificarEpisodioComponent;
  let fixture: ComponentFixture<ModificarEpisodioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificarEpisodioComponent]
    });
    fixture = TestBed.createComponent(ModificarEpisodioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
