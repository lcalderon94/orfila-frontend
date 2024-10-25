import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuestrasListComponent } from './muestras-list.component';

describe('MuestrasListComponent', () => {
  let component: MuestrasListComponent;
  let fixture: ComponentFixture<MuestrasListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MuestrasListComponent]
    });
    fixture = TestBed.createComponent(MuestrasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
