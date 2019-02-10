import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadonlyFormComponent } from './readonly-form.component';
import { Power } from 'src/app/api/entities/powers/descriptors/power';
import { SrTestBed } from 'src/tests/sr-test-bed';

describe('ReadonlyFormComponent', () => {
  let component: ReadonlyFormComponent<Power>;
  let fixture: ComponentFixture<ReadonlyFormComponent<Power>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      SrTestBed.defaultUiComponentsMetadata(),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent<ReadonlyFormComponent<Power>>(
      ReadonlyFormComponent,
    );
    component = fixture.componentInstance;
    component.item = {
      book: 'book',
      name: 'name'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
