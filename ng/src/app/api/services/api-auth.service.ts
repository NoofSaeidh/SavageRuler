import { ServerResponse } from './../types/responses';
import { Observable } from 'rxjs';
import {
  AuthModel,
  AuthResultModel,
  ExternalAuthResultModel,
  ExternalLoginProviderInfoModel
} from './../types/auth-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ApiDescriptor } from '../types/api-descriptor';
import { buildApiMethodsExtra } from '../types/api-controller';

type AuthRequest =
  | 'Authenticate'
  | 'GetExternalAuthenticationProviders'
  | 'ExternalAuthenticate';
const prefix = '/api/TokenAuth/';
const descriptor = new ApiDescriptor<AuthRequest>({
  name: 'Auth',
  methods: buildApiMethodsExtra(
    prefix,
    { name: 'Authenticate', httpMethod: 'POST' },
    { name: 'GetExternalAuthenticationProviders', httpMethod: 'GET' },
    { name: 'ExternalAuthenticate', httpMethod: 'POST' }
  )
});

@Injectable({
  providedIn: 'root'
})
export class ApiAuthService extends ApiService<AuthRequest> {
  constructor(http: HttpClient) {
    super(http, descriptor);
  }

  login(model: AuthModel): Observable<ServerResponse<AuthResultModel>> {
    return this.makeRequest<AuthResultModel>('Authenticate', { body: model });
  }

  loginExternal(model: AuthModel): Observable<ExternalAuthResultModel> {
    throw new Error('not implemented');
  }

  getExternalProviders(): Observable<ExternalLoginProviderInfoModel[]> {
    throw new Error('not implemented');
  }
}
