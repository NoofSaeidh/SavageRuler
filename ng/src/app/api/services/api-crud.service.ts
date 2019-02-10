import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import {
  ServerResponseList,
  ServerResponse,
  ServerList,
} from '../types/responses';
import { ApiDescriptor } from '../types/api-descriptor';
import { ApiService } from './api.service';
import { IEntity, EntityKey } from 'src/app/api/types/ientity';
import { ApiCrudRequest } from '../types/api-crud-descriptor';

export const toServerResult = <T>(source: Observable<ServerResponse<T>>) =>
  source.pipe(map(value => value.result));

export const toServerListResult = <T>(
  source: Observable<ServerResponseList<T>>,
) => source.pipe(map(value => value.result.items));

@Injectable()
export class ApiCrudService<
  T extends IEntity<TKey>,
  TKey extends EntityKey
> extends ApiService<ApiCrudRequest> {
  constructor(http: HttpClient, descriptor: ApiDescriptor<ApiCrudRequest>) {
    super(http, descriptor);
  }

  getAll(): Observable<ServerResponseList<T>> {
    return this.makeRequest<ServerList<T>>('getAll');
  }

  // todo: move injection into descriptor
  get(id: TKey): Observable<ServerResponse<T>> {
    return this.makeRequest<T>('get', { id });
  }

  create(entity: T): Observable<ServerResponse<T>> {
    return this.makeRequest<T>('create', null, entity);
  }

  // todo: inject key into url (should be in descriptor)
  update(id: TKey, entity: T): Observable<ServerResponse<T>> {
    return this.makeRequest<T>('update', { id }, entity);
  }

  // todo: inject key into url (should be in descriptor)
  delete(id: TKey): Observable<ServerResponse<T>> {
    return this.makeRequest<T>('delete', { id });
  }
}
