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
  private _selected$ = new Subject<{ item?: T; id: TKey; index?: number } | null>();
  private _swipe$ = new Subject<number>();

  public localizeDescriptor: LocalizeDescriptor<T>;
  public items$: Observable<T[]>;
  public selected$: Observable<T | null>;
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
    this.selected$ = combineLatest(this.items$, merge(this._selected$, this._swipe$)).pipe(
      map(([items, target]) => {
        let item: T;
        if (typeof target === 'number') {
          // todo: swipe
        } else {
          if (target.item) {
            item = target.item;
          } else if (target.index) {
            item = items[target.index];
          }
          if (!item && target.id) {
            item = items.find(i => i.id === target.id);
          }
          if (!item) {
            return null;
          }
        }
        return { item, id: item.id };
      }),
      filter(i => !!i),
      switchMap(i => {
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
