import { Injectable } from '@angular/core';
import { ApiLocalizationService } from '../api/services/api-localization.service';
import {
  LocalStorageService,
  LocalStorage,
  SharedStorage,
  CookieStorage,
} from 'ngx-store';
import { LocalizeDescriptor } from '../types/descriptors/localize-descriptor';
import { Observable, of } from 'rxjs';
import { Dictionary } from '../types/global/dictionary';
import { first, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  @LocalStorage()
  private localizedEntities: {
    culture: string;
    entities?: Dictionary<LocalizeDescriptor<any>, string>;
  } = { culture: '', entities: {} };

  constructor(protected api: ApiLocalizationService) {}

  localizeEntity<T>(typeName: string): Observable<LocalizeDescriptor<T>> {
    const entity = this.localizedEntities.entities[typeName];
    if (entity) {
      return of(entity);
    }
    return this.api.getLocalizedProperties<T>(typeName).pipe(
      map(r => r.result),
      first(),
      tap(
        r => {
          this.addLocalizedEntity(typeName, r);
          console.log('fetch ' + typeName);
        }, // need force change
        e => {
          this.addLocalizedEntity(typeName, {});
          console.error('Localization error happened.', e);
        },
      ),
    );
  }
  private addLocalizedEntity<T>(
    typeName: string,
    descr: LocalizeDescriptor<T>,
  ) {
    this.localizedEntities.entities[typeName] = descr;
    this.localizedEntities = { ...this.localizedEntities }; // force save
  }
}
