import { Location } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  InjectionToken,
  OnInit,
  ViewChild,
  AfterViewInit,
  TemplateRef,
  AfterContentInit,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { filter, first } from 'rxjs/operators';
import {
  toServerListResult,
  toServerResult,
} from 'src/app/api/operators/to-server-result';
import { ApiCrudService } from 'src/app/api/services/api-crud.service';
import { EntityKey, IEntity } from 'src/app/api/types/ientity';
import { LocalizationService } from 'src/app/localization/localization.service';
import { LoadStateService } from 'src/app/state/load/load-state.service';
import { LocalizeDescriptor } from 'src/app/types/descriptors/localize-descriptor';
import { EntityViewDescriptor } from 'src/app/types/descriptors/view-descriptor';
import { ArrayElement } from 'src/app/types/global/array-element';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable } from 'rxjs';
import { ServerResponse } from 'src/app/api/types/responses';
import { TypeConverter } from 'src/app/helpers/type-converter';

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
  selector: 'sr-primary-screen',
  templateUrl: './primary-screen.component.html',
  styleUrls: ['./primary-screen.component.scss'],
  providers: [
    { provide: LOAD_LIST_STATE, useClass: LoadStateService },
    { provide: LOAD_SINGLE_STATE, useClass: LoadStateService },
  ],
})
export class PrimaryScreenComponent<
  T extends IEntity<TKey>,
  TKey extends EntityKey
> implements OnInit, AfterViewInit {
  @ViewChild('modalForm') modalForm: TemplateRef<any>;

  private _editMode: boolean = false;
  private _showType: ShowType;
  private _modalRef: BsModalRef;
  private _showModalOnInitItem?: TKey;

  selected: ArrayElement<T> | null;
  hasPermission: boolean = false;

  localizeDescriptor: LocalizeDescriptor<T>;

  constructor(
    public viewDescriptor: EntityViewDescriptor<T>,
    protected apiService: ApiCrudService<T, TKey>,
    protected route: ActivatedRoute,
    protected router: Router,
    protected location: Location,
    protected localizationService: LocalizationService,
    protected authService: AuthService,
    protected modalService: BsModalService,
    @Inject(LOAD_LIST_STATE) protected loadListState: LoadStateService<T[]>,
    @Inject(LOAD_SINGLE_STATE) protected loadSingleState: LoadStateService<T>,
  ) {}

  get editMode(): boolean {
    return this._editMode && this.hasPermission;
  }

  set editMode(value: boolean) {
    this._editMode = value;
  }

  get items(): T[] | null {
    return this.loadListState.value;
  }

  get isLoading(): boolean {
    return (
      this.loadListState.state.isLoading && this.loadSingleState.state.isLoading
    );
  }

  get showType(): ShowType {
    if (this._showType === 'GRID') {
      return this._showType;
    }
    return (this.selected && this._showType) || 'GRID';
  }

  set showType(value: ShowType) {
    this._showType = value;
  }

  ngOnInit() {
    this.selected = null;

    this.localizationService
      .localizeEntity(this.viewDescriptor.viewType.typeName)
      .subscribe(result => (this.localizeDescriptor = result));

    const snapshot = this.route.snapshot;
    // todo: handle modal
    const showType = snapshot.url[snapshot.url.length - 1].path.toUpperCase();
    const id = snapshot.queryParams.id;

    // check permissions for edit mode
    // todo: rewrite for every action
    const perms = this.viewDescriptor.viewType.permissions;
    if (!perms) {
      this.hasPermission = true;
    } else {
      this.authService
        .isGranted$(perms.update, perms.create, perms.update)
        .subscribe(r => (this.hasPermission = r));
    }

    this._editMode = TypeConverter.tryParseBoolean(
      snapshot.queryParams.editMode,
      false,
    );

    // todo: check that id would never be 0
    if (showType === 'FORM' && id !== undefined) {
      this.showFormItem(id);
    } else if (id !== undefined) {
      this.showGrid({ dontChangeUrl: true });
      this._showModalOnInitItem = id;
    } else {
      this.showGrid();
    }
  }

  ngAfterViewInit() {
    if (this._showModalOnInitItem) {
      const item = this._showModalOnInitItem;
      this._showModalOnInitItem = undefined;
      // setTimeout is required otherwise here would be angular error
      setTimeout(() => this.showModalItem(item));
    }
  }

  showFormItem(item: ArrayElement<T> | TKey, config?: ShowConfig) {
    const id = this.showItem(item);
    this.showType = 'FORM';
    if (!config || !config.dontChangeUrl) {
      this.changeLocation('FORM', id);
    }
  }

  showModalItem(item: ArrayElement<T> | TKey, config?: ShowConfig) {
    const id = this.showItem(item);
    this.showType = 'MODAL';
    this._modalRef = this.modalService.show(this.modalForm, {
      class: 'modal-lg',
    });
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

  onGridRowClicked(event: { item: T; index: number; mouse: MouseEvent }) {
    if (event.mouse.altKey) {
      this.showFormItem(event);
    } else if (event.mouse.ctrlKey) {
      window.open(this.buildUrl('FORM', event.item.id));
    } else {
      this.showModalItem(event);
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.showType === 'GRID') {
      return;
    }
    if (event.key === 'ArrowLeft') {
      this.changeSelected(-1);
    } else if (event.key === 'ArrowRight') {
      this.changeSelected(+1);
    }
  }

  saveItem(item: T) {
    console.log(item);
    if (!item) {
      throw new Error('Cannot save not initialized item.');
    }
    let obs: Observable<ServerResponse<T>>;
    if (item.id) {
      obs = this.apiService.update(item.id, item);
    } else {
      obs = this.apiService.create(item);
    }
    obs.subscribe(r => this.ensureItemsLoaded(true));
  }

  hideModal() {
    if (this._modalRef) {
      this._modalRef.hide();
    }
  }

  private changeSelected(diff: number) {
    if (!this.selected || !this.items || diff === 0) {
      return;
    }
    if (!this.selected.index) {
      // cannot use indexOf - because element could be not referencly equal
      this.selected.index = this.items.findIndex(
        item => item.id === this.selected.item.id,
      );
    }
    const resultIndex = this.selected.index + diff;
    if (resultIndex < 0 || resultIndex >= this.items.length) {
      return;
    }
    this.selected = {
      item: this.items[resultIndex],
      index: resultIndex,
    };
    this.location.replaceState(
      this.buildUrl(this.showType, this.selected.item.id),
    );
  }

  private showItem(item: ArrayElement<T> | TKey): TKey {
    let id: TKey;
    if (typeof item === 'object' /* is T */) {
      id = item.item.id;
      this.selected = item;
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
    const editMode = this.editMode || (this.hasPermission ? false : null);
    return this.router
      .createUrlTree(['../' + type], {
        relativeTo: this.route,
        queryParams: { id, view, editMode },
      })
      .toString();
  }

  private ensureItemsLoaded(forceReload?: boolean) {
    if (this.items && !forceReload) {
      return;
    }
    this.loadListState.load(
      this.apiService.getAll().pipe(toServerListResult()),
    );
  }

  private ensureSelectedItemLoaded(id: TKey) {
    if (this.selected && this.selected.item.id === id) {
      return;
    }
    if (
      this.loadSingleState.state.isLoaded &&
      this.loadSingleState.value.id === id
    ) {
      this.selected = { item: this.loadSingleState.value };
      return;
    }
    if (this.loadListState.state.isLoaded) {
      // todo: refetch if not?
      this.selected = { item: this.loadListState.value.find(i => i.id === id) };
    }
    if (!this.selected) {
      this.loadSingleState.load(this.apiService.get(id).pipe(toServerResult()));
      this.loadSingleState.subject
        .pipe(
          filter(state => state.isLoaded),
          first(),
        )
        .subscribe(state => {
          this.selected = { item: state.value };
        });
    }
  }
}
