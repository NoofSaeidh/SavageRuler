import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, concat } from 'rxjs';
import { first, map, filter } from 'rxjs/operators';
import { toServerResult } from 'src/app/api/operators/to-server-result';
import { LanguageInfo } from 'src/app/api/types/localization';
import { LocalizationService } from 'src/app/localization/localization.service';

@Component({
  selector: 'sr-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  languages: LanguageInfo[];
  currentLanguage: LanguageInfo;
  enabled: boolean = false;

  constructor(
    protected localizationService: LocalizationService,
  ) {}

  ngOnInit() {
    // get all languages will be executed first
    this.subscription = concat(
      this.localizationService.api.getAllLanguages().pipe(
        first(),
        toServerResult(),
        map(r => r.filter(i => !i.isDisabled)),
      ),
      this.localizationService.culture$.pipe(filter(v => !!v)),
    ).subscribe(r => {
      if (Array.isArray(r)) {
        // languages
        this.languages = r;
        if (r.length > 1) {
          this.enabled = true;
        }
      } else {
        // culture
        this.currentLanguage = this.languages.find(i => i.name === r);
        if (!this.currentLanguage) {
          throw new Error(`Server doesn't support specified culture.`);
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  changeCulture(culture: string) {
    this.localizationService.changeCulture(culture);
  }
}
