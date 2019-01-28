import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiDescriptor, ApiUrls } from '../types/api-descriptor';
import { Observable } from 'rxjs';
import { ServerReponseList, ServerReponse, ServerList } from '../types/responses';
import { map } from 'rxjs/operators';
import { IEntity, EntityKey } from 'src/app/types/api/ientity';

// todo: perhaps move out and add to descriptor
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

@Injectable({
  providedIn: 'root',
})
export abstract class ApiService<T extends IEntity<TKey>, TKey extends EntityKey> {
  constructor(private _http: HttpClient, public descriptor: ApiDescriptor<T>) {}

  getAll(): Observable<ServerReponseList<T>> {
    return this.request<ServerList<T>>('GET', 'getAll');
  }

  // todo: inject key into url (should be in descriptor)
  get(key: TKey): Observable<ServerReponse<T>> {
    return this.request<T>('GET', 'get');
  }

  create(entity: T): Observable<ServerReponse<T>> {
    return this.request<T>('POST', 'create', entity);
  }

  // todo: inject key into url (should be in descriptor)
  update(key: TKey, entity: T): Observable<ServerReponse<T>> {
    return this.request<T>('PUT', 'update', entity);
  }

  // todo: inject key into url (should be in descriptor)
  delete(key: TKey): Observable<ServerReponse<T>> {
    return this.request<T>('DELETE', 'delete');
  }


  private request<TResult>(
    httpMethod: HttpMethod,
    apiKey: keyof ApiUrls,
    body?: any,
  ): Observable<ServerReponse<TResult>> {
    // it will throw error if no specified
    const url = this.descriptor.getUrl(apiKey);
    return this._http.request<ServerReponse<TResult>>(httpMethod, url, {
      body,
    });
  }
}
