import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiCrudService } from '../../services/api-crud.service';
import { Power } from './types/power';
import { ApiCrudDescriptor } from '../../types/api-crud-descriptor';

export const descriptor = new ApiCrudDescriptor('Power');

@Injectable({
  providedIn: 'root'
})
export class PowersApiService extends ApiCrudService<Power, number> {
  constructor(http: HttpClient) {
    super(http, descriptor);
  }
}
