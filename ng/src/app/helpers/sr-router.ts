import {
  ActivatedRoute,
  Router,
  UrlTree,
  NavigationExtras,
} from '@angular/router';
import { Dictionary } from '../types/global/dictionary';

export interface SrNavigationExtras extends NavigationExtras {
  navigationType?: 'Go' | 'SoftGo' | 'Replace'; // soft go - for location change, go for router change
}

export class SrRouter {
  constructor(
    public readonly activatedRoute: ActivatedRoute,
    public readonly router: Router,
    public readonly location: Location,
  ) {}

  navigate(url: UrlTree | string, extras?: SrNavigationExtras) {
    const ntype = (extras && extras.navigationType) || 'Go';
    switch (ntype) {
      case 'Go':
        break;
      case 'SoftGo':
        break;
      case 'Replace':
        break;
    }
  }
}
