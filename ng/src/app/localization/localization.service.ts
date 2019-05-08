import { Inject, Injectable, InjectionToken } from '@angular/core';
import { LocalStorageService, WebStorageConfigInterface } from 'ngx-store';
import { Resource } from 'ngx-store/src/service/resource';
import { BehaviorSubject, concat, Observable, of, zip } from 'rxjs';
import { filter, first, map, switchAll, tap } from 'rxjs/operators';

import { toServerResult } from '../api/operators/to-server-result';
import { ApiLocalizationService } from '../api/services/api-localization.service';
import { ServerResponse } from '../api/types/responses';
import { LocalizeDescriptor } from '../types/descriptors/localize-descriptor';
import { Dictionary } from '../types/global/dictionary';

declare var NGXSTORE_CONFIG: WebStorageConfigInterface;

const localizationPrefix = NGXSTORE_CONFIG.prefix + 'localization.';
const localizationPrefixEntity = localizationPrefix + 'entity.';

// perhaps should use DI for that
const localizationSources = ['Abp', 'AbpZero', 'AbpWeb', 'SavageRuler'];

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  private _cultureResource: Resource<string> = this.loadFromStorage('culture');
  private _localizedStringsResource: Resource<{}> = this.loadFromStorage(
    'localized-strings',
  );
  private _cultureState$ = new BehaviorSubject({ culture: '', loading: false });
  readonly culture$: Observable<string> = this._cultureState$.pipe(
    filter(r => !r.loading),
    map(r => r.culture),
  );

  constructor(
    public api: ApiLocalizationService,
    protected localStorage: LocalStorageService,
  ) {
    if (this._cultureResource.value) {
      this._cultureState$.next({
        loading: false,
        culture: this._cultureResource.value,
      });
    } else {
      this.resetCulture();
    }
  }

  changeCulture(culture: string) {
    if (!culture) {
      throw new Error('Culture not specified');
    }
    if (!this._cultureState$.value.loading) {
      // culture already in local storage
      if (culture === this._cultureState$.value.culture) {
        return;
      }
      // culture was in storage from previos session, need just update
      if (culture === this._cultureResource.value) {
        this._cultureState$.next({
          loading: false,
          culture: culture,
        });
      }
    }
    this._cultureState$.next({
      culture: culture,
      loading: true,
    });
    this.api
      .changeCulture(culture)
      .pipe(first())
      .subscribe(r => {
        this.clearLocalization();
        this._cultureResource.save(culture);
        this._cultureState$.next({
          culture: culture,
          loading: false,
        });
      });
  }

  // reset to current culture on SERVER (depends on user and cookies)
  resetCulture() {
    this.api
      .getCurrentLanguage()
      .pipe(first())
      .subscribe(r => this.changeCulture(r.result.name));
  }

  clearLocalization() {
    this.localStorage.clear('prefix', localizationPrefix);
  }

  localizeEntity<T>(typeName: string): Observable<LocalizeDescriptor<T>> {
    const resource = this.loadFromStorage<LocalizeDescriptor<T>>(
      typeName,
      'ENTITY',
    );

    // api request
    const apiRequest = this.api.getLocalizedProperties<T>(typeName).pipe(
      map(r => r.result),
      first(),
      tap(
        r => {
          resource.save(r);
        },
        e => {
          resource.save({});
          console.error('Localization error happened.', e);
        },
      ),
    );

    return this.culture$.pipe(
      map(culture => {
        if (culture === this._cultureResource.value && resource.value) {
          return of(resource.value);
        }
        return apiRequest;
      }),
      switchAll(),
    );
  }

  localizeStrings(): Observable<Dictionary<string, string>> {
    // api request
    const sourcesToObservables: () => Observable<
      ServerResponse<Dictionary<string, string>>
    >[] = () => {
      const res = [];
      for (const source of localizationSources) {
        res.push(this.api.getLocalizedStrings(source));
      }
      return res;
    };

    const apiRequest = zip(...sourcesToObservables()).pipe(
      map(r => Object.assign({}, ...r.map(rr => rr.result)) as Dictionary<string>),
      first(),
      tap(r => this._localizedStringsResource.save(r))
    );
    return this.culture$.pipe(
      map(culture => {
        if (
          culture === this._cultureResource.value &&
          this._localizedStringsResource.value
        ) {
          return of(this._localizedStringsResource.value);
        }
        return apiRequest;
      }),
      switchAll(),
    );
  }

  private loadFromStorage<T = string>(
    key: string,
    type?: 'ENTITY',
  ): Resource<T> {
    const prefix =
      type === 'ENTITY' ? localizationPrefixEntity : localizationPrefix;
    return this.localStorage.load(key).setPrefix(prefix);
  }
}
