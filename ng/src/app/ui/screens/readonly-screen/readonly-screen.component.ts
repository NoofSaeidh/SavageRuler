import {
  Component,
  OnInit,
  InjectionToken,
  Inject,
  TemplateRef,
  ElementRef,
  ViewChild,
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
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

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
  ],
})
export class ReadonlyScreenComponent<
  T extends IEntity<TKey>,
  TKey extends EntityKey
> implements OnInit {
  selectedItem: T | null;
  showType: ShowType;
  @ViewChild('modalTemplate') modalTemplate: TemplateRef<any>;
  modalRef: BsModalRef;

  constructor(
    protected apiService: ApiCrudService<T, TKey>,
    // protected modalService: NgbModal,
    protected route: ActivatedRoute,
    protected router: Router,
    protected location: Location,
    private modalService: BsModalService,
    @Inject(LOAD_LIST_STATE) protected loadListState: LoadStateService<T[]>,
    @Inject(LOAD_SINGLE_STATE) protected loadSingleState: LoadStateService<T>,
  ) {}

  ngOnInit() {
    this.selectedItem = null;
    const snapshot = this.route.snapshot;
    // todo: handle modal
    const showType =
      snapshot.url[snapshot.url.length - 1].path.toUpperCase() === 'FORM' ? 'FORM' : 'GRID';
    const id = snapshot.queryParams.id;
    this.openScreen({ showType, id });
  }

  get items(): T[] | null {
    return this.loadListState.value;
  }

  get isLoading(): boolean {
    return (
      this.loadListState.state.isLoading && this.loadSingleState.state.isLoading
    );
  }

  openScreen(data?: { showType?: ShowType; id?: TKey }) {
    if (data && data.showType === 'FORM' && data.id) {
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
    this.modalRef = this.modalService.show(this.modalTemplate, {
      class: 'modal-lg',
    });
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

  gridRowClicked(event: { item: T; mouse: MouseEvent }) {
    if (event.mouse.altKey) {
      this.showFormItem(event.item);
    } else if (event.mouse.ctrlKey) {
      window.open(
        this.router
          .createUrlTree(['../form'], {
            relativeTo: this.route,
            queryParams: { id: event.item.id },
          })
          .toString(),
      );
    } else {
      this.showModalItem(event.item);
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
