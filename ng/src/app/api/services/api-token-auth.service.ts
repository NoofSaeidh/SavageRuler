import { ServerResponse } from '../types/responses';
import { Observable } from 'rxjs';
import {
  AuthModel,
  AuthResultModel,
  ExternalAuthResultModel,
  ExternalLoginProviderInfoModel
} from '../types/auth-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ApiDescriptor } from '../types/api-descriptor';
import { buildApiMethodsExtra } from '../types/api-controller';

const prefix = '/api/TokenAuth/';
const descriptor = new ApiDescriptor<keyof ApiTokenAuthService>({
  name: 'Auth',
  methods: buildApiMethodsExtra(
    prefix,
    { name: 'authenticate', httpMethod: 'POST' },
    { name: 'getExternalAuthenticationProviders', httpMethod: 'GET' },
    { name: 'externalAuthenticate', httpMethod: 'POST' }
  )
});

@Injectable({
  providedIn: 'root'
})
export class ApiTokenAuthService extends ApiService<keyof ApiTokenAuthService> {
  constructor(http: HttpClient) {
    super(http, descriptor);
  }

  authenticate(model: AuthModel): Observable<ServerResponse<AuthResultModel>> {
    return this.makeRequest<AuthResultModel>('authenticate', { body: model });
  }

  externalAuthenticate(model: AuthModel): Observable<ExternalAuthResultModel> {
    throw new Error('not implemented');
  }

  getExternalAuthenticationProviders(): Observable<ExternalLoginProviderInfoModel[]> {
    throw new Error('not implemented');
  }
}
