import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertEventModalComponent } from './alert-event-modal.component';

describe('AlertEventModalComponent', () => {
  let component: AlertEventModalComponent;
  let fixture: ComponentFixture<AlertEventModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertEventModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertEventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
