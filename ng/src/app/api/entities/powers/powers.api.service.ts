import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiCrudService } from '../../services/api-crud.service';
import { Power } from './descriptors/power';
import { POWER_API_DESCRIPTOR } from './descriptors/power-api-descriptor';
import { ApiCrudDescriptor } from '../../types/api-crud-descriptor';

@Injectable({
  providedIn: 'root',
})
export class PowersApiService extends ApiCrudService<Power, number> {
  constructor(http: HttpClient, @Inject(POWER_API_DESCRIPTOR) descriptor: ApiCrudDescriptor) {
    super(http, descriptor);
  }
}
