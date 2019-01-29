import { TestBed } from '@angular/core/testing';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { ApiCrudService } from './api-crud.service';
import { Power } from 'src/app/api/entities/powers/descriptors/power';
import { ApiDescriptor } from '../types/api-descriptor';



describe('ApiCrudService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      {provide: ApiDescriptor, useValue: new ApiDescriptor({})}
    ]
  }));

  it('should be created', () => {
    const service: ApiCrudService<Power, number> = TestBed.get(ApiCrudService);
    expect(service).toBeTruthy();
  });
});
