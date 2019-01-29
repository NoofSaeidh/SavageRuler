import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoGridComponent } from './info-grid.component';
import { IEntity } from 'src/app/types/api/ientity';

describe('InfoGridComponent', () => {
  let component: InfoGridComponent<IEntity, number>;
  let fixture: ComponentFixture<InfoGridComponent<IEntity, number>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
