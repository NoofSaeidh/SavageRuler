import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
  HostListener,
} from '@angular/core';
import { IEntity, EntityKey } from 'src/app/api/types/ientity';
import { BehaviorSubject, Subject, Subscription, Observable, of, zip, merge } from 'rxjs';
import { ViewState } from '@angular/core/src/view';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ArrayElement } from 'src/app/types/global/array-element';
import { LocalizeDescriptor } from 'src/app/types/descriptors/localize-descriptor';
import { EntityViewDescriptor } from 'src/app/types/descriptors/view-descriptor';
import { ApiCrudService } from 'src/app/api/services/api-crud.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalizationService } from 'src/app/localization/localization.service';
import { AuthService } from 'src/app/auth/auth.service';
import { toServerListResult, toServerResult } from 'src/app/api/operators/to-server-result';
import {
  map,
  switchMap,
  mergeMap,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  startWith,
  tap,
} from 'rxjs/operators';
import { StringHelper } from 'src/app/helpers/string-helper';

const query = {
  id: 'id',
  view: 'view',
};

type ViewType = 'Grid' | 'Form' | 'Modal' | 'EditForm' | 'EditModal';

class View {
  readonly form: boolean;
  readonly modal: boolean;
  readonly edit: boolean;
  readonly grid: boolean;
  readonly type: ViewType;
  constructor(type?: ViewType) {
    this.type = type || 'Grid';
    this.form = this.type.indexOf('Form') >= 0;
    this.modal = this.type.indexOf('Modal') >= 0;
    this.edit = this.type.indexOf('Edit') >= 0;
    this.grid = !this.form && !this.modal;
  }
  static parse(type?: string): View {
    if (!type) {
      return new View();
    }
    return new View(
      StringHelper.tryParseValues<ViewType>(type, 'Grid', 'Form', 'Modal', 'EditForm', 'EditModal'),
    );
  }
  static build(input: { form?: boolean; modal?: boolean; edit?: boolean }): View {
    let type;
    if (input.modal) {
      type = 'Modal';
    } else if (input.form) {
      type = 'Form';
    }
    if (type && input.edit) {
      type = 'Edit' + type;
    }
    return new View(type as ViewType);
  }
}

@Component({
  selector: 'sr-primary-screen',
  templateUrl: './primary-screen.component.html',
  styleUrls: ['./primary-screen.component.scss'],
})
export class PrimaryScreenComponent<T extends IEntity<TKey>, TKey extends EntityKey>
  implements OnInit, OnDestroy {
  @ViewChild('modalForm') modalForm: TemplateRef<any>;

  private _subscription: Subscription;
  private _selected$ = new Subject<{ item?: T; id: TKey } | null>();

  public localizeDescriptor: LocalizeDescriptor<T>;
  public items$: Observable<T[]>;
  public selected$: Observable<T | null>;
  public view$: Observable<View>;
  // public view$: Observable<

  // todo:
  public editMode = false;
  public permissions = false;

  constructor(
    public viewDescriptor: EntityViewDescriptor<T>,
    protected apiService: ApiCrudService<T, TKey>,
    protected router: Router,
    protected route: ActivatedRoute,
    protected localizationService: LocalizationService,
    protected authService: AuthService,
    protected modalService: BsModalService,
  ) {}

  ngOnInit() {
    console.log(this);
    this.items$ = this.apiService.getAll().pipe(toServerListResult());
    this.selected$ = this._selected$.pipe(
      distinctUntilKeyChanged('id'),
      switchMap(i => {
        if (!i) {
          return of(null);
        }
        if (i.item) {
          return of(i.item);
        }
        return this.apiService.get(i.id).pipe(toServerResult());
      }),
    );
    this.view$ = this.route.queryParamMap.pipe(
      map(q => q.get(query.view)),
      distinctUntilChanged(),
      map(v => View.parse(v)),
    );

    this._subscription = new Subscription()
      .add(
        this.localizationService
          .localizeEntity(this.viewDescriptor.viewType.typeName)
          .subscribe(r => (this.localizeDescriptor = r)),
      )
      .add(
        this.route.queryParamMap.subscribe(q => {
          const id = q.get(query.id);
          if (id) {
            // todo: parse type
            this._selected$.next({ id: id as TKey });
          }
        }),
      );
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  hideModal() {}

  onGridRowClicked(event: { item: T; index: number; mouse: MouseEvent }) {
    this._selected$.next({ item: event.item, id: event.item.id });
    this.router.navigate([], {
      queryParams: {
        view: 'Form',
        id: event.item.id,
      },
      queryParamsHandling: 'merge',
    });
    // if (event.mouse.altKey) {
    //   this._showFormItem(event);
    // } else if (event.mouse.ctrlKey) {
    //   // this._navigate({
    //   //   showType: 'Form',
    //   //   id: event.item.id,
    //   //   extras: {
    //   //     newWindow: true,
    //   //   },
    //   // });
    // } else {
    //   this._showModalItem(event);
    // }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // if (this.showType === 'Grid') {
    //   return;
    // }
    switch (event.key) {
      case 'ArrowLeft':
        // this.stateService.swipeItem$.next(-1);
        break;
      case 'ArrowRight':
        // this.stateService.swipeItem$.next(+1);
        break;
      case 'Escape':
        this.router.navigate([], {
          queryParams: {
            view: 'Grid',
            id: null,
          },
          queryParamsHandling: 'merge',
        });
        break;
    }
  }
}

// import {
//   AfterViewInit,
//   Component,
//   HostListener,
//   Inject,
//   InjectionToken,
//   OnInit,
//   TemplateRef,
//   ViewChild,
//   OnDestroy,
//   Injector,
// } from '@angular/core';
// import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
// import { BsModalRef, BsModalService } from 'ngx-bootstrap';
// import { Observable, Subject, Subscription, BehaviorSubject } from 'rxjs';
// import { filter, first, throttleTime, distinctUntilChanged } from 'rxjs/operators';
// import { toServerListResult, toServerResult } from 'src/app/api/operators/to-server-result';
// import { ApiCrudService } from 'src/app/api/services/api-crud.service';
// import { EntityKey, IEntity } from 'src/app/api/types/ientity';
// import { ServerResponse } from 'src/app/api/types/responses';
// import { AuthService } from 'src/app/auth/auth.service';
// import { TypeConverter } from 'src/app/helpers/type-converter';
// import { LocalizationService } from 'src/app/localization/localization.service';
// import { LoadStateService } from 'src/app/state/load/load-state.service';
// import { LocalizeDescriptor } from 'src/app/types/descriptors/localize-descriptor';
// import { EntityViewDescriptor } from 'src/app/types/descriptors/view-descriptor';
// import { ArrayElement } from 'src/app/types/global/array-element';
// import { Dictionary } from 'src/app/types/global/dictionary';
// import { Location } from '@angular/common';
// import { PrimaryScreenStateService } from './primary-screen-state.service';
// import { StringHelper } from 'src/app/helpers/string-helper';

// export const LOAD_LIST_STATE = new InjectionToken<LoadStateService<any>>(
//   'List load state for readonly screen',
// );
// export const LOAD_SINGLE_STATE = new InjectionToken<LoadStateService<any[]>>(
//   'Single item load state for readonly screen',
// );

// type ShowType = 'Grid' | 'Form' | 'Modal';
// type EditShowType = 'EditForm' | 'EditModal';
// export type FullShowType = ShowType | EditShowType;

// function parseShowType(value: string, allowEdit: boolean): FullShowType | null {
//   if (!value) {
//     return null;
//   }
//   const type = StringHelper.tryParseValues<ShowType>(value, 'Grid', 'Form', 'Modal');
//   if (type) {
//     return type;
//   }
//   if (allowEdit) {
//     return StringHelper.tryParseValues<EditShowType>(value, 'EditForm', 'EditModal');
//   }
// }

// const queryParams = {
//   view: 'view',
//   id: 'id',
// };

// interface ViewState<T,TKey> {
//   item?: T;
//   id?: TKey;
//   editMode?: boolean;
//   modal?: boolean;
// }

// // interface ShowConfig {
// //   dontChangeUrl?: boolean;
// // }

// @Component({
//   selector: 'sr-primary-screen',
//   templateUrl: './primary-screen.component.html',
//   styleUrls: ['./primary-screen.component.scss'],
//   // providers: [
//   //   { provide: LOAD_LIST_STATE, useClass: LoadStateService },
//   //   { provide: LOAD_SINGLE_STATE, useClass: LoadStateService },
//   // ],
// })
// export class PrimaryScreenComponent<T extends IEntity<TKey>, TKey extends EntityKey>
//   implements OnInit, AfterViewInit, OnDestroy {
//   @ViewChild('modalForm') modalForm: TemplateRef<any>;

//   private _items$ = new BehaviorSubject<T[] | null>(null);
//   // private _selected$ = new BehaviorSubject<ArrayElement<T> | null>(null);
//   private _selectedKey$ = new Subject<TKey>();
//   private _swipeItem$ = new Subject<number>();
//   // private _showType$ = new BehaviorSubject<FullShowType>('Grid');
//   private _editMode$ = new BehaviorSubject<boolean | null>(null);
//   // private _isLoading$ = new BehaviorSubject<boolean>(true);
//   // private _permissions$ = new ReplaySubject<boolean>(1); // todo: permission types
//   private _viewState$ = new Subject<ViewState<T, TKey>>();

//   private _modalRef: BsModalRef;
//   private _subscription: Subscription;

//   // private _items: T[] | null;
//   private _selected: ArrayElement<T> | null;
//   private _showType: FullShowType = 'Grid';
//   // private _editMode: boolean | null;
//   // private _isLoading: boolean;
//   private _permissions: boolean; // todo: permission types

//   private _localizeDescriptor: LocalizeDescriptor<T>;

//   constructor(
//     public viewDescriptor: EntityViewDescriptor<T>,
//     protected apiService: ApiCrudService<T, TKey>,
//     protected router: Router,
//     protected route: ActivatedRoute,
//     protected localizationService: LocalizationService,
//     protected authService: AuthService,
//     protected modalService: BsModalService,
//   ) {}

//   get items(): T[] | null {
//     return this._items$.value;
//   }

//   get selected(): T | null {
//     return (this._selected && this._selected.item) || null;
//   }

//   get showType(): FullShowType {
//     return this._showType;
//   }

//   get editMode(): boolean | null {
//     return (this._editMode$.value && this._permissions) || null;
//   }

//   set editMode(value: boolean | null) {
//     // todo: navigation
//     this._editMode$.next(value);
//     // this.stateService.editMode$.next(value);
//   }

//   get isLoading(): boolean {
//     return !this._items$.value; // || !!this._selected$.value;
//   }

//   get permissions(): boolean {
//     return this._permissions;
//   }

//   get localizeDescriptor(): LocalizeDescriptor<T> {
//     return this._localizeDescriptor;
//   }

//   get showGrid(): boolean {
//     return this._showType !== 'Form' && this._showType !== 'EditForm';
//   }

//   ngOnInit() {
//     console.log(this);

//     this._subscription = this._subscribe();

//     // if (!this.stateService.initialized) {
//     //   this._initialize();
//     // }
//   }

//   private _subscribe(): Subscription {
//     return (
//       new Subscription()
//         .add(
//           this.localizationService
//             .localizeEntity(this.viewDescriptor.viewType.typeName)
//             .subscribe(r => (this._localizeDescriptor = r)),
//         )
//         // .add(
//         //   this._selectedKey$.pipe(distinctUntilChanged()).subscribe(k => {
//         //     const index = this.items.findIndex(i => i.id === k);
//         //     if (index >= 0) {
//         //       this._selected$.next({ index, item: this.items[index] });
//         //     } else {
//         //       // todo: handler
//         //       console.warn(`Element with key: ${k} not found.`);
//         //     }
//         //   }),
//         // )
//         .add(
//           this.apiService
//             .getAll()
//             .pipe(toServerListResult())
//             .subscribe(this._items$),
//         )
//         .add(
//           this.route.queryParamMap.subscribe(v => {
//             console.log(this.route);
//             const type = parseShowType(v.get(queryParams.view), this._permissions);
//             if (type && type !== 'Grid') {
//               this.editMode = type.indexOf('Edit') >= 0;
//             }

//             // todo: other types
//             const id = v.get(queryParams.id) as TKey;
//             if (id) {
//               if (!this.selected || this.selected.id !== id) {
//                 if(!this.)
//                 // const index = this.items.findIndex(i => i.id === id);
//                 // if (index >= 0) {
//                 //   this._selected = {
//                 //     index,
//                 //     item: this.items[index],
//                 //   };
//                 // } else {
//                 //   // todo: error
//                 // }
//               }
//               this._showType = type === 'Grid' ? 'Modal' : type || 'Modal';
//             } else {
//               this._showType = 'Grid';
//             }
//             console.log([this._showType, this._selected, id]);
//           }),
//         )
//     );
//   }

//   ngOnDestroy() {
//     this._subscription.unsubscribe();
//   }

//   ngAfterViewInit() {
//     // if (this._showModalOnInitItem) {
//     //   const item = this._showModalOnInitItem;
//     //   this._showModalOnInitItem = undefined;
//     //   // setTimeout is required otherwise here would be angular error
//     //   setTimeout(() => this.showModalItem(item));
//     // }
//   }

//   private _showFormItem(item: ArrayElement<T>) {
//     this._selected = item;
//     this._navigate(item.item.id, false, this.editMode);
//     // this.stateService.selected$.next(item);
//     // this.stateService.showType$.next('Form');
//     // if (!config || !config.dontChangeUrl) {
//     //   this._navigate({ showType: 'Form', id });
//     // }
//   }

//   private _showModalItem(item: ArrayElement<T>) {
//     this._selected = item;
//     this._navigate(item.item.id, true, this.editMode);
//     this._modalRef = this.modalService.show(this.modalForm, {
//       class: 'modal-lg',
//       keyboard: false,
//     });
//   }

//   private _showGrid() {
//     this._navigate();
//   }

//   onGridRowClicked(event: { item: T; index: number; mouse: MouseEvent }) {
//     if (event.mouse.altKey) {
//       this._showFormItem(event);
//     } else if (event.mouse.ctrlKey) {
//       // this._navigate({
//       //   showType: 'Form',
//       //   id: event.item.id,
//       //   extras: {
//       //     newWindow: true,
//       //   },
//       // });
//     } else {
//       this._showModalItem(event);
//     }
//   }

//   @HostListener('window:keydown', ['$event'])
//   onKeyDown(event: KeyboardEvent) {
//     if (this.showType === 'Grid') {
//       return;
//     }
//     switch (event.key) {
//       case 'ArrowLeft':
//         // this.stateService.swipeItem$.next(-1);
//         break;
//       case 'ArrowRight':
//         // this.stateService.swipeItem$.next(+1);
//         break;
//       case 'Escape':
//         this.hideModal();
//         break;
//     }
//   }

//   saveItem(item: T) {
//     if (!item) {
//       throw new Error('Cannot save not initialized item.');
//     }
//     let obs: Observable<ServerResponse<T>>;
//     if (item.id) {
//       obs = this.apiService.update(item.id, item);
//     } else {
//       obs = this.apiService.create(item);
//     }
//     // todo:
//     // obs.subscribe(r => this.ensureItemsLoaded(true));
//   }

//   hideModal() {
//     if (this._modalRef) {
//       this._modalRef.hide();
//       this._navigate();
//       // this.stateService.showType$.next('Grid');
//       // this._navigate({ id: null });
//     }
//   }

//   private swipeItem(diff: number) {
//     console.log([this.selected, this.items]);
//     // if (!this.selected || !this.items || diff === 0) {
//     //   // todo: fetch items
//     //   return;
//     // }
//     // if (!this._selected.index) {
//     //   // cannot use indexOf - because element could be not referencly equal
//     //   this._selected.index = this.items.findIndex(item => item.id === this._selected.item.id);
//     // }
//     // const resultIndex = this._selected.index + diff;
//     // if (resultIndex < 0 || resultIndex >= this.items.length) {
//     //   return;
//     // }
//     // this.stateService.selected$.next({
//     //   item: this.items[resultIndex],
//     //   index: resultIndex,
//     // });
//     // this._navigate({
//     //   showType: this.showType,
//     //   id: this.selected.item.id,
//     //   extras: { replace: true },
//     // });
//   }

//   private _navigate(id?: TKey, modal?: boolean, editMode?: boolean) {
//     const view = !id ? 'Grid' : (editMode ? 'Edit' : '') + (modal ? 'Modal' : 'Form');
//     this.router.navigate([], {
//       queryParams: { id, view },
//       queryParamsHandling: 'merge',
//     });
//   }

//   // private _navigate({
//   //   showType,
//   //   id,
//   //   editMode,
//   //   extras,
//   // }: {
//   //   // undefined means don't change, null means set to null
//   //   showType?: ShowType;
//   //   id?: TKey | null;
//   //   editMode?: boolean | null;
//   //   extras?: {
//   //     newWindow?: boolean;
//   //     replace?: boolean;
//   //     preserveParams?: boolean;
//   //     useRooter?: boolean; // router recreates component, so default is using location
//   //   };
//   // }) {
//   //   const [path, view] =
//   //     showType === 'Modal'
//   //       ? [['../grid'], 'Modal']
//   //       : [showType ? ['../' + showType.toLowerCase()] : ['./'], null];

//   //   const params: Dictionary<any> = {};
//   //   if (id !== undefined) {
//   //     params.id = id;
//   //   }
//   //   if (editMode !== undefined) {
//   //     params.editMode = editMode;
//   //   }
//   //   params.view = view;

//   //   const navExtras: NavigationExtras = {
//   //     queryParamsHandling: 'merge',
//   //     queryParams: params,
//   //     relativeTo: this.route,
//   //   };
//   //   if (extras) {
//   //     if (extras.replace) {
//   //       navExtras.replaceUrl = true;
//   //     }
//   //     if (extras.preserveParams) {
//   //       navExtras.queryParamsHandling = 'preserve';
//   //     }
//   //     if (extras.newWindow) {
//   //       window.open(this.router.createUrlTree(path, navExtras).toString());
//   //       return;
//   //     }
//   //     if (extras.useRooter) {
//   //       this.router.navigate(path, navExtras);
//   //     }
//   //   }
//   //   this.router.navigate(path, navExtras);
//   // }
// }
