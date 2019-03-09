import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SrTestBed } from 'src/tests/sr-test-bed';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule(
      SrTestBed.defaultViewComponentsMetadata(),
    ).compileComponents();
  }));

  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Savage Ruler'`, () => {
    expect(app.title).toEqual('Savage Ruler');
  });
});
