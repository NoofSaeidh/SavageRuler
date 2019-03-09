import { Injectable } from '@angular/core';
import { LocalizationService } from './localization.service';
import { Dictionary } from '../types/global/dictionary';

@Injectable({
  providedIn: 'root',
})
export class LocalizationDictionary implements Dictionary<string, string> {
  [k: string]: string;

  constructor(service: LocalizationService) {
    let strings: Dictionary<string, string> = {};
    service.localizeStrings().subscribe(r => (strings = r));

    return new Proxy(this, {
      get: (t, p, r) => {
        if (typeof p !== 'string') {
          throw new Error('Only string are supported as keys');
        }
        let res = strings[p];
        // for some reason Angular calls ngOnDestroy for this in initialization
        if (res === undefined && p !== 'ngOnDestroy') {
          console.warn(`Property ${p} is not localized.`);
          // means that it is not localzied
          res = '[' + p + ']';
        }
        return res;
      },
    });
  }
}
