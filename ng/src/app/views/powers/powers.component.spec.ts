import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowersComponent } from './powers.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReadonlyScreenComponent } from 'src/app/ui/screens/readonly-screen/readonly-screen.component';
import { ApiCrudService } from 'src/app/api/services/api-crud.service';
import { PowersApiService } from 'src/app/api/entities/powers/powers.api.service';
import { SrTestBed } from 'src/tests/sr-test-bed';
import { AppModule } from 'src/app/app.module';

describe('PowersComponent', () => {
  let component: PowersComponent;
  let fixture: ComponentFixture<PowersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
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
