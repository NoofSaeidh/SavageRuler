import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

import {
  ServerResponseList,
  ServerResponse,
  ServerList,
} from '../types/responses';
import { ApiDescriptor, ApiUrls } from '../types/api-descriptor';
import { ApiService } from './api.service';
import { IEntity, EntityKey } from 'src/app/api/types/ientity';
import { map } from 'rxjs/operators';

// todo: perhaps move out and add to descriptor
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const toServerResult = <T>(source: Observable<ServerResponse<T>>) =>
  source.pipe(map(value => value.result));

export const toServerListResult = <T>(
  source: Observable<ServerResponseList<T>>,
) => source.pipe(map(value => value.result.items));

@Injectable()
export class ApiCrudService<
  T extends IEntity<TKey>,
  TKey extends EntityKey
> extends ApiService {
  constructor(
    protected http: HttpClient,
    protected descriptor: ApiDescriptor<T>,
  ) {
    super();
  }

  getAll(): Observable<ServerResponseList<T>> {
    return this.request<ServerList<T>>('GET', 'getAll');
  }

  // todo: move injection into descriptor
  get(id: TKey): Observable<ServerResponse<T>> {
    return this.request<T>('GET', 'get', { id });
  }

  create(entity: T): Observable<ServerResponse<T>> {
    return this.request<T>('POST', 'create', null, entity);
  }

  // todo: inject key into url (should be in descriptor)
  update(id: TKey, entity: T): Observable<ServerResponse<T>> {
    return this.request<T>('PUT', 'update', { id }, entity);
  }

  // todo: inject key into url (should be in descriptor)
  delete(id: TKey): Observable<ServerResponse<T>> {
    return this.request<T>('DELETE', 'delete', { id });
  }

  protected request<TResult>(
    httpMethod: HttpMethod,
    apiKey: keyof ApiUrls,
    query?: {},
    body?: any,
  ): Observable<ServerResponse<TResult>> {
    // it will throw error if no specified
    const url = this.descriptor.getUrl(apiKey, { query });
    return this.http.request<ServerResponse<TResult>>(httpMethod, url, {
      body,
    });
  }
}
