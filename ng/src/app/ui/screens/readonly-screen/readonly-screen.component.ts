import { Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  InjectionToken,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { filter, first } from 'rxjs/operators';
import {
  ApiCrudService,
  toServerListResult,
  toServerResult,
} from 'src/app/api/services/api-crud.service';
import { EntityKey, IEntity } from 'src/app/api/types/ientity';
import { LoadStateService } from 'src/app/state/load/load-state.service';

export const LOAD_LIST_STATE = new InjectionToken<LoadStateService<any>>(
  'List load state for readonly screen',
);
export const LOAD_SINGLE_STATE = new InjectionToken<LoadStateService<any[]>>(
  'Single item load state for readonly screen',
);

type ShowType = 'GRID' | 'FORM' | 'MODAL';

interface ShowConfig {
  dontChangeUrl?: boolean;
}

@Component({
  selector: 'sr-readonly-screen',
  templateUrl: './readonly-screen.component.html',
  styleUrls: ['./readonly-screen.component.scss'],
  providers: [
    { provide: LOAD_LIST_STATE, useClass: LoadStateService },
    { provide: LOAD_SINGLE_STATE, useClass: LoadStateService },
  ],
})
export class ReadonlyScreenComponent<
  T extends IEntity<TKey>,
  TKey extends EntityKey
> implements OnInit {
  selectedItem: T | null;
  showType: ShowType;
  showModalOnInit: boolean = false;

  @ViewChild('modalForm') modalForm: ModalDirective;

  constructor(
    protected apiService: ApiCrudService<T, TKey>,
    protected route: ActivatedRoute,
    protected router: Router,
    protected location: Location,
    @Inject(LOAD_LIST_STATE) protected loadListState: LoadStateService<T[]>,
    @Inject(LOAD_SINGLE_STATE) protected loadSingleState: LoadStateService<T>,
  ) {}

  get items(): T[] | null {
    return this.loadListState.value;
  }

  get isLoading(): boolean {
    return (
      this.loadListState.state.isLoading && this.loadSingleState.state.isLoading
    );
  }

  ngOnInit() {
    this.selectedItem = null;
    const snapshot = this.route.snapshot;
    // todo: handle modal
    const showType = snapshot.url[snapshot.url.length - 1].path.toUpperCase();
    const id = snapshot.queryParams.id;
    // todo: check that id would never be 0
    if (showType === 'FORM' && id !== undefined) {
      this.showFormItem(id);
    } else if (id !== undefined) {
      this.showGrid({ dontChangeUrl: true });
      // simplified showModalItem, because modal not initialized here yet
      this.showItem(id);
      this.showModalOnInit = true;
      this.showType = 'MODAL';
      this.changeLocation('MODAL', id);
    } else {
      this.showGrid();
    }
  }

  showFormItem(item: T | TKey, config?: ShowConfig) {
    const id = this.showItem(item);
    this.showType = 'FORM';
    if (!config || !config.dontChangeUrl) {
      this.changeLocation('FORM', id);
    }
  }

  showModalItem(item: T | TKey, config?: ShowConfig) {
    const id = this.showItem(item);
    this.showType = 'MODAL';
    this.modalForm.show();
    if (!config || !config.dontChangeUrl) {
      this.changeLocation('MODAL', id);
    }
  }

  showGrid(config?: ShowConfig) {
    this.showType = 'GRID';
    this.ensureItemsLoaded();
    if (!config || !config.dontChangeUrl) {
      this.changeLocation('GRID');
    }
  }

  gridRowClicked(event: { item: T; mouse: MouseEvent }) {
    if (event.mouse.altKey) {
      this.showFormItem(event.item);
    } else if (event.mouse.ctrlKey) {
      window.open(this.buildUrl('FORM', event.item.id));
    } else {
      this.showModalItem(event.item);
    }
  }

  private showItem(item: T | TKey): TKey {
    let id: TKey;
    if (typeof item === 'object' /* is T */) {
      id = item.id;
      this.selectedItem = item;
    } /* is TKey */ else {
      id = item;
      this.ensureSelectedItemLoaded(id);
    }
    return id;
  }

  private changeLocation(showType: ShowType, id?: TKey) {
    this.location.go(this.buildUrl(showType, id));
  }

  private buildUrl(showType: ShowType, id?: TKey) {
    const type = showType === 'MODAL' ? 'grid' : showType.toLowerCase();
    let view;
    if (showType === 'MODAL') {
      view = 'modal';
    }
    return this.router
      .createUrlTree(['../' + type], {
        relativeTo: this.route,
        queryParams: { id, view },
      })
      .toString();
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
