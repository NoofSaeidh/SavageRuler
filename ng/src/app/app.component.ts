import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'sr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Savage Ruler';

  navbarCollapsed = true;

  constructor(private router: Router, private titleService: Title) {
  }

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
    this.titleService.setTitle(this.title);
  }
}
