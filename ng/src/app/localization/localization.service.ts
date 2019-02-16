import { Injectable, OnInit, OnDestroy, TypeDecorator } from '@angular/core';
import { ApiLocalizationService } from '../api/services/api-localization.service';
import {
  LocalStorageService,
  LocalStorage,
  SharedStorage,
  CookieStorage,
  CookiesStorageService,
} from 'ngx-store';
import { LocalizeDescriptor } from '../types/descriptors/localize-descriptor';
import {
  Observable,
  of,
  Subscription,
  BehaviorSubject,
  concat,
  merge,
} from 'rxjs';
import { Dictionary } from '../types/global/dictionary';
import { first, map, tap, filter } from 'rxjs/operators';
import { Resource } from 'ngx-store/src/service/resource';
import { SubjectSubscriber, Subject } from 'rxjs/internal/Subject';
import { MergeMapOperator } from 'rxjs/internal/operators/mergeMap';

const localizationPrefix = 'ngx_sr_.localization.';

@Injectable({
  providedIn: 'root',
})
export class LocalizationService implements OnInit, OnDestroy {
  private cultureState$ = new BehaviorSubject({ culture: '', loading: false });
  // private subscription: Subscription;

  constructor(
    public api: ApiLocalizationService,
    protected localStorage: LocalStorageService,
  ) {}

  ngOnInit() {
    // this.subscription = this.cultureState$
    //   .pipe(filter(c => !c.loading))
    //   .subscribe(c => this.loadFromStorage('culture').save(c.culture));
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  get culture(): string | null {
    return (
      this.loadFromStorage('culture').value ||
      this.cultureState$.value.culture ||
      null
    );
  }

  // todo: error handling
  set culture(value: string) {
    // don't care of state
    if (this.cultureState$.value.culture === value) {
      return;
    }
    const culture = this.loadFromStorage('culture');

    if (culture.value !== value) {
      this.cultureState$.next({
        culture: value,
        loading: true,
      });
      this.api
        .changeCulture(value)
        .pipe(first())
        .subscribe(r => {
          this.clearLocalization();
          culture.save(value);
          this.cultureState$.next({
            culture: value,
            loading: false,
          });
        });
    }
  }

  // todo: error handling
  // todo: refactor for return values everytime culture changes
  localizeEntity<T>(typeName: string): Observable<LocalizeDescriptor<T>> {
    const entity = this.loadFromStorage<LocalizeDescriptor<T>>(
      'type__' + typeName,
    );

    if (!this.cultureState$.value.loading && entity.value) {
      return of(entity.value);
    }

    // api request
    const getSubsc = this.api.getLocalizedProperties<T>(typeName).pipe(
      map(r => r.result),
      first(),
      tap(
        r => {
          entity.save(r);
          console.log('fetch ' + typeName);
        }, // need force change
        e => {
          entity.save({});
          console.error('Localization error happened.', e);
        },
      ),
    );

    if (this.cultureState$.value.loading) {
      // execut eapi request after culture (with cookie) updated
      return concat(
        this.cultureState$.pipe(
          filter(c => !c.loading),
          first(),
        ),
        getSubsc,
      ).pipe(
        filter(r => !('loading' in r && 'culture' in r)),
        // map(r => r as LocalizeDescriptor<T>)
      ) as Observable<LocalizeDescriptor<T>>;
    }

    return getSubsc;
  }

  clearLocalization() {
    this.localStorage.clear('prefix', localizationPrefix);
  }

  private loadFromStorage<T = string>(key: string): Resource<T> {
    return this.localStorage.load(key).setPrefix(localizationPrefix);
  }
}
