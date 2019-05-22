import {
  ActivatedRoute,
  Router,
  UrlTree,
  NavigationExtras,
} from '@angular/router';
import { Dictionary } from '../types/global/dictionary';
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';

export interface NavigationExtrasModificators {
  // inner: NavigationExtras;
  // todo: add location navigation?
  // navigationType?: 'Router' | 'Location';
  relativeToCurrent?: boolean;
  // primary means that query params from activated route would override params from inner extras
  addCurrentQueryParams?: boolean | 'PRIMARY';
}

export type SrNavigationExtras = NavigationExtrasModificators &
  NavigationExtras;

@Injectable({
  providedIn: 'root',
})
export class SrRouter {
  constructor(
    public readonly activatedRoute: ActivatedRoute,
    public readonly router: Router,
    public readonly location: Location,
  ) {}

  navigateByUrl(
    url: UrlTree | string,
    extras?: NavigationExtrasModificators,
  ): Promise<boolean> {
    return this.router.navigateByUrl(url, this.createNavigationExtras(extras));
  }

  navigate(commands: any[], extras?: SrNavigationExtras): Promise<boolean> {
    return this.router.navigate(commands, this.createNavigationExtras(extras));
  }

  createUrlTree(commands: any[], extras?: SrNavigationExtras): UrlTree {
    return this.router.createUrlTree(
      commands,
      this.createNavigationExtras(extras),
    );
  }

  createNavigationExtras(extras?: SrNavigationExtras): NavigationExtras | null {
    if (!extras) {
      return null;
    }
    const result = { ...extras };
    if (extras.relativeToCurrent) {
      result.relativeTo = this.activatedRoute;
    }
    if (extras.addCurrentQueryParams) {
      if (extras.addCurrentQueryParams === 'PRIMARY') {
        result.queryParams = {
          ...extras.queryParams,
          ...this.activatedRoute.queryParams,
        };
      } else {
        result.queryParams = {
          ...this.activatedRoute.queryParams,
          ...extras.queryParams,
        };
      }
    }
    return result;
  }
}
