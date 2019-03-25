import { Injectable } from '@angular/core';
import { Observable, Subscription, Unsubscribable } from 'rxjs';
import { map, share } from 'rxjs/operators';

import { Dictionary } from '../types/global/dictionary';
import { LocalizationService } from './localization.service';
import { StringHelper } from '../types/global/string-helper';

@Injectable({
  providedIn: 'root',
})
export class Localizer implements Unsubscribable {
  private _strings: Dictionary<string, string>;
  private _observable: Observable<Dictionary<string, string>>;
  private _subscription: Subscription;
  constructor(service: LocalizationService) {
    this._strings = {};
    this._observable = service.localizeStrings().pipe(share());
    this._subscription = this._observable.subscribe(r => (this._strings = r));
  }

  localize(value: string, ...args: any): string {
    return this._localize(this._strings, value, ...args);
  }

  localize$(value: string, ...args: any): Observable<string> {
    return this._observable.pipe(map(r => this._localize(r, value, ...args)));
  }

  private _localize(
    source: Dictionary<string, string>,
    value: string,
    ...args: any[]
  ): string {
    let res = source[value];
    if (!res) {
      console.warn(`String ${value} is not defined for the localization.`);
      return '[' + value + ']';
    }
    if (args) {
      res = StringHelper.objectReplace(res, args);
    }
    return res;
  }

  unsubscribe() {
    this._subscription.unsubscribe();
  }
}
