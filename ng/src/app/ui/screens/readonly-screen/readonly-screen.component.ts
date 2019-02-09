import {
  Component,
  OnInit,
  InjectionToken,
  Inject,
  TemplateRef,
  ElementRef,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { IEntity, EntityKey } from 'src/app/api/types/ientity';
import {
  ApiCrudService,
  toServerResult,
  toServerListResult,
} from 'src/app/api/services/api-crud.service';
import { LoadStateService } from 'src/app/state/load/load-state.service';
import { first, filter } from 'rxjs/operators';
import { Location } from '@angular/common';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalFormComponent } from './modal-form/modal-form.component';

export const LOAD_LIST_STATE = new InjectionToken<LoadStateService<any>>(
  'List load state for readonly screen',
);
export const LOAD_SINGLE_STATE = new InjectionToken<LoadStateService<any[]>>(
  'Single item load state for readonly screen',
);

type ShowType = 'GRID' | 'FORM' | 'MODAL';

@Component({
  selector: 'sr-readonly-screen',
  templateUrl: './readonly-screen.component.html',
  styleUrls: ['./readonly-screen.component.scss'],
  providers: [
    { provide: LOAD_LIST_STATE, useClass: LoadStateService },
    { provide: LOAD_SINGLE_STATE, useClass: LoadStateService },
  ]
})
export class ReadonlyScreenComponent<
  T extends IEntity<TKey>,
  TKey extends EntityKey
> implements OnInit {
  selectedItem: T | null;
  showType: ShowType;

  constructor(
    protected apiService: ApiCrudService<T, TKey>,
    protected modalService: NgbModal,
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

  showFormItem(item: T | TKey) {
    const id = this.showItem(item);
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

  showModalItem(item: T | TKey) {
    const id = this.showItem(item);
    this.showType = 'MODAL';
    this.modalService.open(ModalFormComponent);
    this.location.replaceState(
      this.router
        .createUrlTree([], {
          relativeTo: this.route,
          queryParams: { id: id, view: 'modal' },
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

  gridRowClicked(event: { item: T; mouseEvent: MouseEvent }) {
    this.showModalItem(event.item);
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
