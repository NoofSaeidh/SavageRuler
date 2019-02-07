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
import {
  Router,
  NavigationStart,
  ActivatedRoute,
  NavigationEnd,
} from '@angular/router';

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
    this.selectedItem = null;
    this.openScreen(this.route.snapshot.queryParams);
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
      this.showFormItem(data.id);
    } else {
      this.showGrid();
    }
  }

  showFormItem(item: T | TKey) {
    let id: TKey;
    if (typeof item === 'object' /* is T */) {
      id = item.id;
      this.selectedItem = item;
    } /* is TKey */ else {
      id = item;
      this.ensureSelectedItemLoaded(id);
    }
    this.showType = 'FORM';
    this.location.replaceState(
      this.router
        .createUrlTree(['../form'], {
          relativeTo: this.route,
          queryParams: { id: id },
        })
        .toString(),
    );
  }

  showGrid() {
    this.showType = 'GRID';
    this.ensureItemsLoaded();
    this.location.replaceState(
      this.router
        .createUrlTree(['../grid'], {
          relativeTo: this.route,
          queryParams: {},
        })
        .toString(),
    );
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
