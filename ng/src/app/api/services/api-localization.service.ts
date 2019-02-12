import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { LocalizeDescriptor } from 'src/app/types/descriptors/localize-descriptor';
import { ServerResponse } from '../types/responses';
import { buildApiMethods } from '../types/api-controller';
import { ApiDescriptor } from '../types/api-descriptor';
import { CookieStorage } from 'ngx-store';

export const apiLocalizationUrl = {
  controller: environment.appUrl + '/api',
};

const prefix = '/api/services/app/Localization/';
const descriptor = new ApiDescriptor({
  name: 'Localization',
  methods: buildApiMethods<keyof ApiLocalizationService>(
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
});

export const apiCultureCookieName = 'Abp.Localization.CultureName';

@Injectable({
  providedIn: 'root',
})
export class ApiLocalizationService extends ApiService<
  keyof ApiLocalizationService
> {
  @CookieStorage('culture')
  currentCulture: string = '';

  constructor(http: HttpClient) {
    super(http, descriptor);
  }

  getLocalizedProperties<T>(
    typeName: string,
  ): Observable<ServerResponse<LocalizeDescriptor<T>>> {
    return this.makeRequest(
      'getLocalizedProperties',
      { typeName },
      { withCredentials: true },
    );
  }
}
