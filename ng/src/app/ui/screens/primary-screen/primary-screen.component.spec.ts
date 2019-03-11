import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Power } from 'src/app/api/entities/powers/types/power';
import { SrTestBed } from 'src/tests/sr-test-bed';
import { PrimaryScreenComponent } from './primary-screen.component';

describe('PrimaryScreenComponent', () => {
  let component: PrimaryScreenComponent<Power, number>;
  let fixture: ComponentFixture<PrimaryScreenComponent<Power, number>>;
  let element: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule(
      SrTestBed.defaultUiComponentsMetadata({
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
    fixture = TestBed.createComponent<PrimaryScreenComponent<Power, number>>(
      PrimaryScreenComponent,
    );
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
