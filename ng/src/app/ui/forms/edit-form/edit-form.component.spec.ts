import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFormComponent } from './edit-form.component';
import { SrTestBed } from 'src/tests/sr-test-bed';

describe('EditFormComponent', () => {
  let component: EditFormComponent<any>;
  let fixture: ComponentFixture<EditFormComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(SrTestBed.defaultUiComponentsMetadata())
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
