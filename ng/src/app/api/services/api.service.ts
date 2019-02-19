import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiDescriptor } from '../types/api-descriptor';
import { Observable } from 'rxjs';
import { ServerResponse } from '../types/responses';
import { EntryKey } from 'src/app/types/global/dictionary';
import { environment } from 'src/environments/environment';

@Injectable()
export abstract class ApiService<TKey extends EntryKey = string> {
  // todo: interceptors here?

  protected headers = new HttpHeaders({ 'X-Requested-With': 'XMLHttpRequest' });

  constructor(
    protected readonly http: HttpClient,
    protected readonly descriptor: ApiDescriptor<TKey>,
  ) {}

  protected makeRequest<TResult>(
    name: TKey,
    options?: {
      query?: {};
      body?: any;
    },
  ): Observable<ServerResponse<TResult>> {
    // it will throw error if no specified
    const method = this.descriptor.getMethod(name);
    return this.http.request<ServerResponse<TResult>>(
      method.httpMethod,
      this.buildUrl(method.url, options && options.query, method.absoluteUrl),
      {
        body: options && options.body,
        headers: this.headers,
        withCredentials: true,
      },
    );
  }

  protected buildQuery(query: {} | string): string {
    if (typeof query === 'string') {
      if (query.startsWith('?')) {
        return query;
      }
      return '?' + query;
    }
    let result: string = '?';
    for (const [key, value] of Object.entries(query)) {
      result += `${key}=${value}`;
    }
    return result;
  }

  protected buildUrl(
    url: string,
    query?: {} | string,
    absoluteUrl?: boolean,
  ): string {
    let result: string;
    if (absoluteUrl) {
      result = url;
    } else {
      result = environment.appUrl;
      if (!url.startsWith('/')) {
        result += '/';
      }
      result += url;
    }

    if (query) {
      result += this.buildQuery(query);
    }
    return result;
  }
}
