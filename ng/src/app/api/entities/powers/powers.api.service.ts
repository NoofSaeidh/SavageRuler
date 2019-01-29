import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiCrudService } from '../../services/api-crud.service';
import { Power } from './descriptors/power';
import { ApiDescriptor } from '../../types/api-descriptor';
import { POWER_API_DESCRIPTOR } from './descriptors/power-api-descriptor';

@Injectable({
  providedIn: 'root',
})
export class PowersApiService extends ApiCrudService<Power, number> {
  constructor(http: HttpClient, @Inject(POWER_API_DESCRIPTOR) descriptor: ApiDescriptor<Power>) {
    super(http, descriptor);
  }
}
