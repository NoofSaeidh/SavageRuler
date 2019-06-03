import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  InjectionToken,
  OnInit,
  TemplateRef,
  ViewChild,
  OnDestroy,
  Injector,
} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, first, throttleTime } from 'rxjs/operators';
import { toServerListResult, toServerResult } from 'src/app/api/operators/to-server-result';
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
import { Location } from '@angular/common';
import { PrimaryScreenStateService } from './primary-screen-state.service';

export const LOAD_LIST_STATE = new InjectionToken<LoadStateService<any>>(
  'List load state for readonly screen',
);
export const LOAD_SINGLE_STATE = new InjectionToken<LoadStateService<any[]>>(
  'Single item load state for readonly screen',
);

export type ShowType = 'GRID' | 'FORM' | 'MODAL';

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
export class PrimaryScreenComponent<T extends IEntity<TKey>, TKey extends EntityKey>
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modalForm') modalForm: TemplateRef<any>;

  // private _editMode: boolean = false;
  // private _showType: ShowType;
  // private _showModalOnInitItem?: TKey;
  // private _swipeSubject: Subject<number>;

  // selected: ArrayElement<T> | null;
  // hasPermission: boolean = false;

  private _modalRef: BsModalRef;
  private _subscription: Subscription;

  private _items: T[] | null;
  private _selected: ArrayElement<T> | null;
  private _showType: ShowType;
  private _editMode: boolean | null;
  private _isLoading: boolean;
  private _permissions: boolean; // todo: permission types

  private _localizeDescriptor: LocalizeDescriptor<T>;

  constructor(
    public viewDescriptor: EntityViewDescriptor<T>,
    protected apiService: ApiCrudService<T, TKey>,
    protected router: Router,
    protected route: ActivatedRoute,
    protected localizationService: LocalizationService,
    protected authService: AuthService,
    protected modalService: BsModalService,
    protected stateService: PrimaryScreenStateService<T, TKey>,
  ) {}

  get items(): T[] | null {
    return this._items;
  }

  get selected(): T | null {
    return (this._selected && this._selected.item) || null;
  }

  get showType(): ShowType {
    return this._showType;
  }

  get editMode(): boolean | null {
    return (this._editMode && this._permissions) || null;
  }

  set editMode(value: boolean | null) {
    this.stateService.editMode$.next(value);
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get permissions(): boolean {
    return this._permissions;
  }

  get localizeDescriptor(): LocalizeDescriptor<T> {
    return this._localizeDescriptor;
  }

  ngOnInit() {
    console.log(this);

    this._subscription = this._subscribeState();

    if (!this.stateService.initialized) {
      this._initializeState();
    }
  }

  private _subscribeState(): Subscription {
    return new Subscription()
      .add(this.stateService.showType$.subscribe(v => (this._showType = v)))
      .add(this.stateService.selected$.subscribe(v => this._setSelected(v)))
      .add(this.stateService.items$.subscribe(v => (this._items = v)))
      .add(this.stateService.isLoading$.subscribe(v => (this._isLoading = v)))
      .add(this.stateService.permissions$.subscribe(v => (this._permissions = v)))
      .add(this.stateService.editMode$.subscribe(v => (this._editMode = v)))
      .add(this.stateService.localizeDescriptor$.subscribe(v => (this._localizeDescriptor = v)))
      .add(this.stateService.swipeItem$.pipe(throttleTime(100)).subscribe(v => this.swipeItem(v)));
  }

  private _initializeState() {
    const state = this.stateService;
    state.isLoading$.next(true);
    state.showType$.next('GRID');
    state.selected$.next(null);
    state.editMode$.next(null);
    this.localizationService
      .localizeEntity(this.viewDescriptor.viewType.typeName)
      .subscribe(state.localizeDescriptor$);

    const perms = this.viewDescriptor.viewType.permissions;
    if (!perms) {
      state.permissions$.next(true);
    } else {
      this.authService
        .isGranted$(perms.update, perms.create, perms.update)
        .subscribe(state.permissions$);
    }

    // todo: lazy?
    this.apiService
      .getAll()
      .pipe(toServerListResult())
      .subscribe(v => {
        state.isLoading$.next(false);
        state.items$.next(v);
      });

    this.stateService.markInitialized();
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  ngAfterViewInit() {
    // if (this._showModalOnInitItem) {
    //   const item = this._showModalOnInitItem;
    //   this._showModalOnInitItem = undefined;
    //   // setTimeout is required otherwise here would be angular error
    //   setTimeout(() => this.showModalItem(item));
    // }
  }

  private _setSelected(item: ArrayElement<T> | TKey) {
    if (typeof item === 'object' /* is T */) {
      this._selected = item;
    } /* is TKey */ else {
      this.apiService
        .get(item)
        .pipe(toServerResult())
        .subscribe(v => (this._selected = { item: v }));
    }
  }

  showFormItem(item: ArrayElement<T> | TKey, config?: ShowConfig) {
    this.stateService.selected$.next(item);
    this.stateService.showType$.next('FORM');
    // if (!config || !config.dontChangeUrl) {
    //   this._navigate({ showType: 'FORM', id });
    // }
  }

  showModalItem(item: ArrayElement<T> | TKey, config?: ShowConfig) {
    this.stateService.selected$.next(item);
    this.stateService.showType$.next('MODAL');
    this._modalRef = this.modalService.show(this.modalForm, {
      class: 'modal-lg',
      keyboard: false,
    });
    // if (!config || !config.dontChangeUrl) {
    //   this._navigate({ showType: 'MODAL', id });
    // }
  }

  showGrid(config?: ShowConfig) {
    this.stateService.showType$.next('GRID');
    // this.showType = 'GRID';
    // this.ensureItemsLoaded();
    // if (!config || !config.dontChangeUrl) {
    //   this._navigate({ showType: 'GRID' });
    // }
  }

  onGridRowClicked(event: { item: T; index: number; mouse: MouseEvent }) {
    if (event.mouse.altKey) {
      this.showFormItem(event);
    } else if (event.mouse.ctrlKey) {
      // this._navigate({
      //   showType: 'FORM',
      //   id: event.item.id,
      //   extras: {
      //     newWindow: true,
      //   },
      // });
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
        this.stateService.swipeItem$.next(-1);
        break;
      case 'ArrowRight':
        this.stateService.swipeItem$.next(+1);
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
    // todo:
    // obs.subscribe(r => this.ensureItemsLoaded(true));
  }

  hideModal() {
    if (this._modalRef) {
      this._modalRef.hide();
      this.stateService.showType$.next('GRID');
      // this._navigate({ id: null });
    }
  }

  private swipeItem(diff: number) {
    console.log([this.selected, this.items]);
    if (!this.selected || !this.items || diff === 0) {
      // todo: fetch items
      return;
    }
    if (!this._selected.index) {
      // cannot use indexOf - because element could be not referencly equal
      this._selected.index = this.items.findIndex(item => item.id === this._selected.item.id);
    }
    const resultIndex = this._selected.index + diff;
    if (resultIndex < 0 || resultIndex >= this.items.length) {
      return;
    }
    this.stateService.selected$.next({
      item: this.items[resultIndex],
      index: resultIndex,
    });
    // this._navigate({
    //   showType: this.showType,
    //   id: this.selected.item.id,
    //   extras: { replace: true },
    // });
  }

  // private _navigate({
  //   showType,
  //   id,
  //   editMode,
  //   extras,
  // }: {
  //   // undefined means don't change, null means set to null
  //   showType?: ShowType;
  //   id?: TKey | null;
  //   editMode?: boolean | null;
  //   extras?: {
  //     newWindow?: boolean;
  //     replace?: boolean;
  //     preserveParams?: boolean;
  //     useRooter?: boolean; // router recreates component, so default is using location
  //   };
  // }) {
  //   const [path, view] =
  //     showType === 'MODAL'
  //       ? [['../grid'], 'modal']
  //       : [showType ? ['../' + showType.toLowerCase()] : ['./'], null];

  //   const params: Dictionary<any> = {};
  //   if (id !== undefined) {
  //     params.id = id;
  //   }
  //   if (editMode !== undefined) {
  //     params.editMode = editMode;
  //   }
  //   params.view = view;

  //   const navExtras: NavigationExtras = {
  //     queryParamsHandling: 'merge',
  //     queryParams: params,
  //     relativeTo: this.route,
  //   };
  //   if (extras) {
  //     if (extras.replace) {
  //       navExtras.replaceUrl = true;
  //     }
  //     if (extras.preserveParams) {
  //       navExtras.queryParamsHandling = 'preserve';
  //     }
  //     if (extras.newWindow) {
  //       window.open(this.router.createUrlTree(path, navExtras).toString());
  //       return;
  //     }
  //     if (extras.useRooter) {
  //       this.router.navigate(path, navExtras);
  //     }
  //   }
  //   this.router.navigate(path, navExtras);
  // }
}
