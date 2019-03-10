import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { SrTestBed } from 'src/tests/sr-test-bed';

import { PowersComponent } from './powers.component';

describe('PowersComponent', () => {
  let component: PowersComponent;
  let fixture: ComponentFixture<PowersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      SrTestBed.defaultViewComponentsMetadata({
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: { url: [{ path: 'screen/grid' }], queryParams: {} },
            },
          },
        ],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
