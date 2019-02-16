import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { LocalizeDescriptor } from 'src/app/types/descriptors/localize-descriptor';
import { ServerResponse } from '../types/responses';
import { buildApiMethods, buildApiMethod } from '../types/api-controller';
import { ApiDescriptor } from '../types/api-descriptor';
import { CookieStorage } from 'ngx-store';
import { LanguageInfo } from '../types/localization';

export const apiLocalizationUrl = {
  controller: environment.appUrl + '/api',
};

const prefix = '/api/services/app/Localization/';
const descriptor = new ApiDescriptor<keyof ApiLocalizationService>({
  name: 'Localization',
  methods: {
    ...buildApiMethods<keyof ApiLocalizationService>(
      [
        'getAllLanguages',
        'getCurrentLanguage',
        'getAllSources',
        'getLocalizedStrings',
        'getLocalizedProperties',
      ],
      {
        prefix,
      },
    ),
    changeCulture: {
      url: '/AbpLocalization/ChangeCulture',
      httpMethod: 'POST',
    }
  },
});

@Injectable({
  providedIn: 'root',
})
export class ApiLocalizationService extends ApiService<
  keyof ApiLocalizationService
> {
  constructor(http: HttpClient) {
    super(http, descriptor);
  }

  getLocalizedProperties<T>(
    typeName: string,
  ): Observable<ServerResponse<LocalizeDescriptor<T>>> {
    return this.makeRequest('getLocalizedProperties', { query: { typeName } });
  }

  changeCulture(cultureName: string): Observable<ServerResponse> {
    return this.makeRequest('changeCulture', { query: { cultureName } });
  }

  getAllLanguages(): Observable<ServerResponse<LanguageInfo[]>> {
    return this.makeRequest('getAllLanguages');
  }

  getCurrentLanguage(): Observable<ServerResponse<LanguageInfo>> {
    return this.makeRequest('getCurrentLanguage');
  }
}
