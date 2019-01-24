import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowersComponent } from './powers.component';
import { PowersService } from '../api/powers/powers.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

describe('PowersComponent', () => {
  let component: PowersComponent;
  let fixture: ComponentFixture<PowersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MDBBootstrapModule.forRoot()],
      declarations: [PowersComponent],
      providers: [PowersService],
    }).compileComponents();
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
