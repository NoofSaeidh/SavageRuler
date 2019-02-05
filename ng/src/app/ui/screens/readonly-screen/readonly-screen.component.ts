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
import { Router } from '@angular/router';

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

export const LOAD_LIST_STATE = new InjectionToken<LoadStateService<any>>(
  'List load state',
);
export const LOAD_SINGLE_STATE = new InjectionToken<LoadStateService<any[]>>(
  'Single item load state',
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
    protected routerState: RouterStateService,
    @Inject(LOAD_LIST_STATE) protected loadListState: LoadStateService<T[]>,
    @Inject(LOAD_SINGLE_STATE) protected loadSingleState: LoadStateService<T>,
  ) {}

  ngOnInit() {
    this.selectedItem = null;
    // loaded from id path
    this.routerState.activatedRoute.queryParams.subscribe(params => {
      console.log('activatedRoute ' + params.id);
      if (params.id) {
        this._showFormItem(params.id);
      } else {
        this._showGrid();
      }
    });
    const idParam = this.routerState.activatedRoute.snapshot.queryParams.id;
    if (idParam) {
      this.showType = 'FORM';
      // todo: To Key conversion???
      this.ensureSelectedItemLoaded(idParam);
    } else {
      this.showType = 'GRID';
      this.ensureItemsLoaded();
    }
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

  showFormItem(item: T) {
    // tricky optimization through state
    this.loadSingleState.subject.next(LoadState.fromLoaded(item));
    this.routerState.setQuery({ id: item.id });
  }

  showGrid() {
    this.routerState.setQuery({});
  }

  // no changes to route here
  private _showFormItem(id: TKey) {
    this.ensureSelectedItemLoaded(id);
    this.showType = 'FORM';
  }

  private _showGrid() {
    this.ensureItemsLoaded();
    this.showType = 'GRID';
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
          console.log(state);
        });
    }
  }
}
