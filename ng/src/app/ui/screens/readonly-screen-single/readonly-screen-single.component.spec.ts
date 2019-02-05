import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadonlyScreenSingleComponent } from './readonly-screen-single.component';
import { Power } from 'src/app/api/entities/powers/descriptors/power';

describe('ReadonlyScreenSingleComponent', () => {
  let component: ReadonlyScreenSingleComponent<Power, number>;
  let fixture: ComponentFixture<ReadonlyScreenSingleComponent<Power, number>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadonlyScreenSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent<ReadonlyScreenSingleComponent<Power, number>>(ReadonlyScreenSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
