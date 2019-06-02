import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  InjectionToken,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, first, throttleTime } from 'rxjs/operators';
import {
  toServerListResult,
  toServerResult,
} from 'src/app/api/operators/to-server-result';
import { ApiCrudService } from 'src/app/api/services/api-crud.service';
import { EntityKey, IEntity } from 'src/app/api/types/ientity';
import { ServerResponse } from 'src/app/api/types/responses';
import { AuthService } from 'src/app/auth/auth.service';
import { TypeConverter } from 'src/app/helpers/type-converter';
import { LocalizationService } from 'src/app/localization/localization.service';
import { LoadStateService } from 'src/app/state/load/load-state.service';
import { LocalizeDescriptor } from 'src/app/types/descriptors/localize-descriptor';
import { EntityViewDescriptor } from 'src/app/types/descriptors/view-descriptor';
import { ArrayElement } from 'src/app/types/global/array-element';
import { Dictionary } from 'src/app/types/global/dictionary';

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
  private _swipeSubscription: Subscription;
  private _swipeSubject: Subject<number>;

  selected: ArrayElement<T> | null;
  hasPermission: boolean = false;

  localizeDescriptor: LocalizeDescriptor<T>;

  constructor(
    public viewDescriptor: EntityViewDescriptor<T>,
    protected apiService: ApiCrudService<T, TKey>,
    protected router: Router,
    protected route: ActivatedRoute,
    protected localizationService: LocalizationService,
    protected authService: AuthService,
    protected modalService: BsModalService,
    @Inject(LOAD_LIST_STATE) protected loadListState: LoadStateService<T[]>,
    @Inject(LOAD_SINGLE_STATE) protected loadSingleState: LoadStateService<T>,
  ) {}

  get editMode(): boolean | null {
    return this._editMode === null
      ? null
      : this._editMode && this.hasPermission;
  }

  set editMode(value: boolean | null) {
    if (this._editMode !== value) {
      this._editMode = value;
      this.navigate({ editMode: value, extras: { replace: true } });
    }
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

    this._swipeSubject = new Subject<number>();
    this._swipeSubscription = this._swipeSubject
      .pipe(throttleTime(100))
      .subscribe(e => this.swipeItem(e));

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
      this.navigate({ showType: 'FORM', id });
    }
  }

  showModalItem(item: ArrayElement<T> | TKey, config?: ShowConfig) {
    const id = this.showItem(item);
    this.showType = 'MODAL';
    this._modalRef = this.modalService.show(this.modalForm, {
      class: 'modal-lg',
      keyboard: false,
    });
    if (!config || !config.dontChangeUrl) {
      this.navigate({ showType: 'MODAL', id });
    }
  }

  showGrid(config?: ShowConfig) {
    this.showType = 'GRID';
    this.ensureItemsLoaded();
    if (!config || !config.dontChangeUrl) {
      this.navigate({ showType: 'GRID' });
    }
  }

  onGridRowClicked(event: { item: T; index: number; mouse: MouseEvent }) {
    if (event.mouse.altKey) {
      this.showFormItem(event);
    } else if (event.mouse.ctrlKey) {
      this.navigate({
        showType: 'FORM',
        id: event.item.id,
        extras: {
          newWindow: true,
        },
      });
    } else {
      this.showModalItem(event);
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.showType === 'GRID') {
      return;
    }
    switch (event.key) {
      case 'ArrowLeft':
        this._swipeSubject.next(-1);
        break;
      case 'ArrowRight':
        this._swipeSubject.next(+1);
        break;
      case 'Escape':
        this.hideModal();
        break;
    }
  }

  saveItem(item: T) {
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
      this.showType = 'GRID';
      this.navigate({});
    }
  }

  private swipeItem(diff: number) {
    if (
      this.showType === 'GRID' ||
      !this.selected ||
      !this.items ||
      diff === 0
    ) {
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
    this.navigate({
      showType: this.showType,
      id: this.selected.item.id,
      extras: { replace: true },
    });
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

  private navigate({
    showType,
    id,
    editMode,
    extras,
  }: {
    // undefined means don't change, null means set to null
    showType?: ShowType;
    id?: TKey | null;
    editMode?: boolean | null;
    extras?: {
      newWindow?: boolean;
      replace?: boolean;
      preserveParams?: boolean;
    };
  }) {
    const [path, view] =
      showType === 'MODAL'
        ? [['../grid'], 'modal']
        : [showType ? ['../' + showType.toLowerCase()] : ['./'], null];

    const params: Dictionary<any> = {};
    if (id !== undefined) {
      params.id = id;
    }
    if (editMode !== undefined) {
      params.editMode = editMode;
    }
    params.view = view;

    const navExtras: NavigationExtras = {
      queryParamsHandling: 'merge',
      queryParams: params,
      relativeTo: this.route,
    };
    if (extras) {
      if (extras.replace) {
        navExtras.replaceUrl = true;
      }
      if (extras.preserveParams) {
        navExtras.queryParamsHandling = 'preserve';
      }
      if (extras.newWindow) {
        window.open(this.router.createUrlTree(path, navExtras).toString());
        return;
      }
    }
    this.router.navigate(path, navExtras);
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
