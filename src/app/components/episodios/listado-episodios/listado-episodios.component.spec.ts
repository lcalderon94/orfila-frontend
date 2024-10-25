import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoEpisodiosComponent } from './listado-episodios.component';

describe('ListadoEpisodiosComponent', () => {
  let component: ListadoEpisodiosComponent;
  let fixture: ComponentFixture<ListadoEpisodiosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListadoEpisodiosComponent]
    });
    fixture = TestBed.createComponent(ListadoEpisodiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
