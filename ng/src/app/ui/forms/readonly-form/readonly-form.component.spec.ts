import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadonlyFormComponent } from './readonly-form.component';
import { SrTestBed } from 'src/tests/sr-test-bed';
import { IEntity } from 'src/app/api/types/ientity';

describe('ReadonlyFormComponent', () => {
  let component: ReadonlyFormComponent<IEntity>;
  let fixture: ComponentFixture<ReadonlyFormComponent<IEntity>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      SrTestBed.defaultUiComponentsMetadata(),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent<ReadonlyFormComponent<IEntity>>(
      ReadonlyFormComponent,
    );
    component = fixture.componentInstance;
     // todo: move to stub?
     component.view = {
      viewType: { typeName: 'test', titleKey: 'id' },
      entries: [{ key: 'id', value: {} }],
    };
    component.item = {id: 1};
    component.localize = {
      id: 'id',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
