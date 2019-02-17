import { Injectable } from '@angular/core';
import { LocalStorage, LocalStorageService } from 'ngx-store';
import { Resource } from 'ngx-store/src/service/resource';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, first, map, switchAll, tap } from 'rxjs/operators';

import { ApiLocalizationService } from '../api/services/api-localization.service';
import { LocalizeDescriptor } from '../types/descriptors/localize-descriptor';

const localizationPrefix = 'ngx_sr_.localization.';
const localizationPrefixEntity = localizationPrefix + 'entity.';

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  @LocalStorage({ key: 'culture', prefix: localizationPrefix })
  private _cultureStorage = '';
  private _cultureState$ = new BehaviorSubject({ culture: '', loading: false });
  culture$: Observable<string> = this._cultureState$.pipe(
    filter(r => !r.loading),
    map(r => r.culture),
  );

  constructor(
    public api: ApiLocalizationService,
    protected localStorage: LocalStorageService,
  ) {}

  changeCulture(culture: string) {
    if (!culture) {
      throw new Error('Culture not specified');
    }
    const storage = this.loadFromStorage('culture');
    if (
      !this._cultureState$.value.loading &&
      culture === this._cultureState$.value.culture
    ) {
      return;
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
        storage.save(culture);
        this._cultureState$.next({
          culture: culture,
          loading: false,
        });
      });
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
          console.log('fetch ' + typeName);
        }, // need force change
        e => {
          resource.save({});
          console.error('Localization error happened.', e);
        },
      ),
    );

    return this.culture$.pipe(
      map(culture => {
        if (culture === this._cultureStorage && resource.value) {
          return of(resource.value);
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
