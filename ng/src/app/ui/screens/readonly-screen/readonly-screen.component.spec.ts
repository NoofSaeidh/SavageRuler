import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadonlyScreenComponent } from './readonly-screen.component';
import { Power } from 'src/app/api/entities/powers/descriptors/power';
import { ApiCrudService } from 'src/app/api/services/api-crud.service';
import { PowersApiService } from 'src/app/api/entities/powers/powers.api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from 'src/app/app.module';
import { SrTestBed } from 'src/tests/sr-test-bed';

describe('ReadonlyScreenComponent', () => {
  let component: ReadonlyScreenComponent<Power, number>;
  let fixture: ComponentFixture<ReadonlyScreenComponent<Power, number>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(SrTestBed.defaultUiComponentsMetadata()).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent<ReadonlyScreenComponent<Power, number>>(
      ReadonlyScreenComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
