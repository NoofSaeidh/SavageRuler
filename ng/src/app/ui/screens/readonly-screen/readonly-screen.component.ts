import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  InjectionToken,
  Inject,
} from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';

import { IEntity, EntityKey } from 'src/app/api/types/ientity';
import {
  ApiCrudService,
  toServerResult,
  toServerListResult,
} from 'src/app/api/services/api-crud.service';
import { LoadListStateService } from 'src/app/state/load/load-list-state.service';
import { RouterStateService } from 'src/app/state/router/router-state.service';
import { LoadStateService } from 'src/app/state/load/load-state.service';
import { Token } from '@angular/compiler';
import { first, filter } from 'rxjs/operators';
import { LoadState } from 'src/app/state/types/load-state';
import { Location } from '@angular/common';

export const LOAD_LIST_STATE = new InjectionToken<LoadStateService<any>>(
  'List load state for readonly screen',
);
export const LOAD_SINGLE_STATE = new InjectionToken<LoadStateService<any[]>>(
  'Single item load state for readonly screen',
);

type ShowType = 'GRID' | 'FORM';

interface ScreenNavigationExtras {
  dontChangeQuery: boolean;
}

@Component({
  selector: 'sr-readonly-screen',
  templateUrl: './readonly-screen.component.html',
  styleUrls: ['./readonly-screen.component.scss'],
})
export class ReadonlyScreenComponent<
  T extends IEntity<TKey>,
  TKey extends EntityKey
> implements OnInit {
  selectedItem: T | null;
  showType: ShowType;

  constructor(
    protected apiService: ApiCrudService<T, TKey>,
    protected route: ActivatedRoute,
    protected router: Router,
    protected location: Location,
    @Inject(LOAD_LIST_STATE) protected loadListState: LoadStateService<T[]>,
    @Inject(LOAD_SINGLE_STATE) protected loadSingleState: LoadStateService<T>,
  ) {}

  ngOnInit() {
    console.log('init screen');
    this.selectedItem = null;
    this.openScreen(this.route.snapshot.queryParams);
    // this.route.queryParams.subscribe(query => {
    //   console.log(query);
    //   // const current = this.routerState.router.getCurrentNavigation();
    //   // openScreen only for newly opened screen, or browser navigation buttons
    //   // if (!current || current.trigger === 'popstate') {
    //   this.openScreen(query);
    //   // }
    // });

    // this.openScreen(this.routerState.activatedRoute.snapshot.queryParams);
    // this.routerState.router.events
    //   .pipe(
    //     filter(
    //       (event: NavigationStart) =>
    //         event instanceof NavigationStart &&
    //         // watch only browser navigation - self navigation handled by component itselft
    //         event.navigationTrigger === 'popstate',
    //     ),
    //   )
    //   .subscribe(event => {
    //     console.log(this.routerState.activatedRoute.snapshot.queryParams);
    //     this.openScreen(this.routerState.activatedRoute.snapshot.queryParams);
    //   });

    // const idParam = this.routerState.activatedRoute.snapshot.queryParams.id;
    // if (idParam) {
    //   this.showType = 'FORM';
    //   // todo: To Key conversion???
    //   this.ensureSelectedItemLoaded(idParam);
    // } else {
    //   this.showType = 'GRID';
    //   this.ensureItemsLoaded();
    // }
    // this.routerState.activatedRoute.params.subscribe(params => {
    //   console.log('activatedRoute ' + params.id);
    //   if (params.id) {
    //     this.showFormItem(params.id);
    //   } else {
    //     this.showGrid();
    //   }
    // });
  }

  get items(): T[] | null {
    return this.loadListState.value;
  }

  get isLoading(): boolean {
    return (
      this.loadListState.state.isLoading && this.loadSingleState.state.isLoading
    );
  }

  openScreen(data?: { id?: TKey }) {
    if (data && data.id) {
      this.showFormItem(data.id, { dontChangeQuery: true });
    } else {
      this.showGrid({ dontChangeQuery: true });
    }
  }

  showFormItem(item: T | TKey, extras?: ScreenNavigationExtras) {
    let id: TKey;
    if (typeof item === 'object' /* is T */) {
      id = item.id;
      this.selectedItem = item;
    } /* is TKey */ else {
      id = item;
      this.ensureSelectedItemLoaded(id);
    }
    this.showType = 'FORM';
    if (!extras || !extras.dontChangeQuery) {
      this.location.go(this.router.createUrlTree(['../form'], {
        relativeTo: this.route,
        queryParams: { id: id },
      }).toString());
    }
  }

  showGrid(extras?: ScreenNavigationExtras) {
    this.showType = 'GRID';
    this.ensureItemsLoaded();
    if (!extras || !extras.dontChangeQuery) {
      this.location.go(this.router.createUrlTree(['../grid'], {
        relativeTo: this.route,
        queryParams: {},
      }).toString());
    }
  }

  private ensureItemsLoaded() {
    if (this.items) {
      return;
    }
    this.loadListState.load(this.apiService.getAll().pipe(toServerListResult));
  }

  private ensureSelectedItemLoaded(id: TKey) {
    if (this.selectedItem && this.selectedItem.id === id) {
      return;
    }
    if (
      this.loadSingleState.state.isLoaded &&
      this.loadSingleState.value.id === id
    ) {
      this.selectedItem = this.loadSingleState.value;
      return;
    }
    if (this.loadListState.state.isLoaded) {
      // todo: refetch if not?
      this.selectedItem = this.loadListState.value.find(i => i.id === id);
    }
    if (!this.selectedItem) {
      this.loadSingleState.load(this.apiService.get(id).pipe(toServerResult));
      this.loadSingleState.subject
        .pipe(
          filter(state => state.isLoaded),
          first(),
        )
        .subscribe(state => {
          this.selectedItem = state.value;
        });
    }
  }
}
