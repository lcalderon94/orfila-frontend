import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasEpisodioComponent } from './notas-episodio.component';

describe('NotasEpisodioComponent', () => {
  let component: NotasEpisodioComponent;
  let fixture: ComponentFixture<NotasEpisodioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotasEpisodioComponent]
    });
    fixture = TestBed.createComponent(NotasEpisodioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
