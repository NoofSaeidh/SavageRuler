import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Power } from 'src/app/types/api/power';
import { ServerReponseList, ServerReponse } from '../types/responses';
import { ApiDescriptor, ApiUrls } from '../types/api-descriptor';

@Injectable({
  providedIn: 'root',
})
export class ApiCrudService<T> {
  constructor(private _http: HttpClient, public descriptor: ApiDescriptor<T>) {}

  getAll(): Observable<T[]> {
    // todo: url, error
    return this._http
      .get<ServerReponseList<T>>(
        'http://localhost:21021/api/services/app/Power/GetAll',
      )
      .pipe(map(value => value.result.items));
  }

  private request<TResult>(
    method: string,
    apiMethod: keyof ApiUrls,
    body: any,
  ): Observable<ServerReponse<TResult>> {
    // it will throw error if no specified
    const url = this.descriptor.getUrl(apiMethod);
    return this._http.request<ServerReponse<TResult>>(method, url, { body });
  }
}
