import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadonlyFormComponent } from './readonly-form.component';

describe('ReadonlyFormComponent', () => {
  let component: ReadonlyFormComponent;
  let fixture: ComponentFixture<ReadonlyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadonlyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadonlyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
