import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LocalizationDictionary } from './localization/localization-dictionary';

@Component({
  selector: 'sr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Savage Ruler';

  navbarCollapsed = true;

  constructor(public L: LocalizationDictionary, private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const { fragment } = this.router.parseUrl(this.router.url);
        if (fragment) {
          const element = document.querySelector(`#${fragment}`);
          if (element) {
            element.scrollIntoView();
          }
        }
      }
    });
  }
}
