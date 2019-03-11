import { Location } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  InjectionToken,
  OnInit,
  ViewChild,
  Input,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { filter, first } from 'rxjs/operators';
import {
  toServerListResult,
  toServerResult,
} from 'src/app/api/operators/to-server-result';
import { ApiCrudService } from 'src/app/api/services/api-crud.service';
import { EntityKey, IEntity } from 'src/app/api/types/ientity';
import { LocalizationDictionary } from 'src/app/localization/localization-dictionary';
import { LocalizationService } from 'src/app/localization/localization.service';
import { LoadStateService } from 'src/app/state/load/load-state.service';
import { LocalizeDescriptor } from 'src/app/types/descriptors/localize-descriptor';
import { EntityViewDescriptor } from 'src/app/types/descriptors/view-descriptor';
import { ArrayElement } from 'src/app/types/global/array-element';
import { AuthService } from 'src/app/auth/auth.service';

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
> implements OnInit {
  @Input() editPermissionName?: string;
  @ViewChild('modalForm') modalForm: ModalDirective;

  selected: ArrayElement<T> | null;
  showType: ShowType;
  showModalOnInit: boolean = false;
  editMode: boolean = false;
  hasPermission: boolean = false;

  localizeDescriptor: LocalizeDescriptor<T>;

  constructor(
    public L: LocalizationDictionary,
    public viewDescriptor: EntityViewDescriptor<T>,
    protected apiService: ApiCrudService<T, TKey>,
    protected route: ActivatedRoute,
    protected router: Router,
    protected location: Location,
    protected localizationService: LocalizationService,
    protected authService: AuthService,
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
    this.selected = null;

    this.localizationService
      .localizeEntity(this.viewDescriptor.viewType.typeName)
      .subscribe(result => (this.localizeDescriptor = result));

    const snapshot = this.route.snapshot;
    // todo: handle modal
    const showType = snapshot.url[snapshot.url.length - 1].path.toUpperCase();
    const id = snapshot.queryParams.id;

    // check permissions for edit mode
    this.hasPermission =
      !this.editPermissionName ||
      this.authService.isGranted(this.editPermissionName);
    this.editMode = this.hasPermission && (!!snapshot.queryParams.editMode || false);

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
    return this.router
      .createUrlTree(['../' + type], {
        relativeTo: this.route,
        queryParams: { id, view, editMode: this.editMode || null },
      })
      .toString();
  }

  private ensureItemsLoaded() {
    if (this.items) {
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
