import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadonlyFieldComponent } from './readonly-field.component';

describe('ReadonlyFieldComponent', () => {
  let component: ReadonlyFieldComponent;
  let fixture: ComponentFixture<ReadonlyFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadonlyFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadonlyFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
