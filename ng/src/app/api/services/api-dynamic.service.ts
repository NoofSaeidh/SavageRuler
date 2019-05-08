import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpMethod } from 'blocking-proxy/built/lib/webdriver_commands';
import { Observable } from 'rxjs';

import { ApiController } from '../types/api-controller';
import { ApiDescriptor } from '../types/api-descriptor';
import { ApiService } from './api.service';
import { ServerResponse } from '../types/responses';

@Injectable({
  providedIn: 'root',
})
export class ApiDynamicService extends ApiService {
  private _dumbController: ApiController;
  constructor(http: HttpClient) {
    const dumbController = { name: 'Dynamic', methods: {} };
    super(http, new ApiDescriptor(dumbController));
    this._dumbController = dumbController;
  }

  public makeRequest<TResult>(
    url: string,
    options?: {
      httpMethod?: HttpMethod; // GET by default
      absoluteUrl?: boolean;
      query?: {};
      body?: any;
    },
  ): Observable<ServerResponse<TResult>> {
    this._dumbController.methods[url] = {
      url: url,
      httpMethod: (options && options.httpMethod) || 'GET',
      absoluteUrl: options && options.absoluteUrl,
    };
    return super.makeRequest(url, options);
  }
}
