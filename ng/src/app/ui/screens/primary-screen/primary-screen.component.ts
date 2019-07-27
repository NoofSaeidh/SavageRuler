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
import {
  BehaviorSubject,
  Subject,
  Subscription,
  Observable,
  of,
  zip,
  merge,
  combineLatest,
  forkJoin,
} from 'rxjs';
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
  throttleTime,
  switchAll,
  mergeAll,
  withLatestFrom,
  scan,
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
    this.grid = !this.form;
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
  @ViewChild('modalForm') public modalForm: TemplateRef<any>;

  private _modalRef: BsModalRef;

  private _subscription: Subscription;
  private _selected$ = new Subject<{ item?: T; id: TKey; index?: number }>();
  private _swipe$ = new Subject<number>();

  public localizeDescriptor: LocalizeDescriptor<T>;
  public items$: Observable<T[]>;
  public selected$: Observable<T>;
  public view$: Observable<View>;

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
    const selected = combineLatest(
      this.items$,
      this._selected$.pipe(
        tap(s => (s.id = parseInt(s.id as string, 10) as TKey)), // todo: support other types
        distinctUntilKeyChanged('id'),
      ),
    ).pipe(
      switchMap(([items, target]) => {
        if (!target.item) {
          if (target.index) {
            // todo: may be out of index, check later
            target.item = items[target.index];
          }
          if (!target.item) {
            const index = items.findIndex(i => i.id === target.id);
            if (index >= 0) {
              target.index = index;
              target.item = items[target.index];
            }
            if (!target.item) {
              return this.apiService.get(target.id).pipe(
                toServerResult(),
                map(i => {
                  target.item = i;
                  return { items, ...target };
                }),
              );
            }
          }
        }
        if (!!target.item && !target.index) {
          target.index = items.indexOf(target.item);
        }
        return of({ items, ...target });
      }),
      filter(i => !!i.item),
    );

    this.selected$ = selected.pipe(
      switchMap(target => {
        if (typeof target.index !== 'number') {
          console.warn('target without index', target);
          return of(target.item);
        }
        // clear swipe, because we already switched
        this._swipe$.next(0);
        return this._swipe$.pipe(
          startWith(0),
          throttleTime(50),
          scan((ac, diff) => ac + diff),
          map(diff => target.index + diff),
          distinctUntilChanged(),
          filter(diff => {
            // hack: adjustments on side values
            if (diff < 0) {
              this._swipe$.next(+1);
            } else if (diff >= target.items.length) {
              this._swipe$.next(-1);
            } else {
              return true;
            }
            return false;
          }),
          map(index => target.items[index]),
        );
      }),
      tap(i => {
        this.router.navigate([], {
          queryParams: {
            id: i.id,
          },
          queryParamsHandling: 'merge',
        });
      }),
    );

    this.view$ = this.route.queryParamMap.pipe(
      map(q => q.get(query.view)),
      distinctUntilChanged(),
      map(v => View.parse(v)),
      tap(v => {
        if (!v.modal && this._modalRef) {
          this._modalRef.hide();
          this._modalRef = null;
        } else if (v.modal && !this._modalRef) {
          // console.log(this.modalForm);
          this._modalRef = this.modalService.show(this.modalForm, {
            class: 'modal-lg',
            keyboard: false,
          });
        }
      }),
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
    this._selected$.next({ item: event.item, id: event.item.id, index: event.index });
    this.router.navigate([], {
      queryParams: {
        view: event.mouse.altKey ? 'Form' : 'Modal',
        id: event.item.id,
      },
      queryParamsHandling: 'merge',
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        this._swipe$.next(-1);
        break;
      case 'ArrowRight':
        this._swipe$.next(+1);
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
