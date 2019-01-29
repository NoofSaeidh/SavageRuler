import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowersComponent } from './powers.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiDescriptor } from 'src/app/api/types/api-descriptor';
import { powerApiDescriptor, POWER_API_DESCRIPTOR } from '../../api/entities/powers/descriptors/power-api-descriptor';

describe('PowersComponent', () => {
  let component: PowersComponent;
  let fixture: ComponentFixture<PowersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowersComponent ],
      imports: [HttpClientTestingModule],
      providers: [
        {provide: POWER_API_DESCRIPTOR, useValue: powerApiDescriptor}
      ]
    })
    .compileComponents();
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
