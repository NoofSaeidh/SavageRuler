import { Injectable } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { QueryParamsHandling } from '@angular/router/src/config';

@Injectable({
  providedIn: 'root',
})
export class RouterStateService {
  constructor(
    public readonly router: Router,
    public readonly location: Location,
    public readonly activatedRoute: ActivatedRoute,
  ) {}

  setQuery(
    queryParams: Params,
    extras?: {
      queryParamsHandling?: QueryParamsHandling;
      replaceUrl?: boolean;
    },
  ) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: extras && extras.queryParamsHandling,
      replaceUrl: extras && extras.replaceUrl,
    });
  }
}
