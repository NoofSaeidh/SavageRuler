import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { SrTestBed } from 'src/tests/sr-test-bed';
import { Title } from '@angular/platform-browser';
import { CollapseModule } from 'ngx-bootstrap';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule(SrTestBed.defaultViewComponentsMetadata()).compileComponents();
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

  it('should render title in a div tag', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div').textContent).toBeTruthy();
  });
});
