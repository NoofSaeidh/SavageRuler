import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoGridComponent } from './info-grid.component';
import { IEntity } from 'src/app/api/types/ientity';
import { SrTestBed } from 'src/tests/sr-test-bed';

describe('InfoGridComponent', () => {
  let component: InfoGridComponent<IEntity, number>;
  let fixture: ComponentFixture<InfoGridComponent<IEntity, number>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      SrTestBed.defaultUiComponentsMetadata(),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoGridComponent);
    component = fixture.componentInstance;
    // todo: move to stub?
    component.view = {
      viewType: { typeName: 'test', titleKey: 'id' },
      entries: [{ key: 'id', value: {} }],
    };
    component.items = [{ id: 1 }];
    component.localize = {
      id: 'id',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
