import { Component, OnInit } from '@angular/core';
import { LocalizationService } from 'src/app/localization/localization.service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { toServerResult } from 'src/app/api/services/api-crud.service';
import { LanguageInfo } from 'src/app/api/types/localization';

@Component({
  selector: 'sr-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent implements OnInit {
  private subscription: Subscription;

  languages: LanguageInfo[];

  constructor(protected localizationService: LocalizationService) {}

  ngOnInit() {
    if (!this.culture) {
      this.localizationService.api
        .getCurrentLanguage()
        .pipe(
          first(),
          toServerResult(),
        )
        .subscribe(r => (this.culture = r.name));
    }
    this.localizationService.api
      .getAllLanguages()
      .pipe(
        first(),
        toServerResult(),
      )
      .subscribe(r => (this.languages = r));
  }

  get culture(): string {
    return this.localizationService.culture;
  }

  set culture(value: string) {
    this.localizationService.culture = value;
  }
}
