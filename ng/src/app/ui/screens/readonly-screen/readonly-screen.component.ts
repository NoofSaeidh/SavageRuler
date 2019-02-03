import { Component, OnInit, OnDestroy } from '@angular/core';
import { IEntity, EntityKey } from 'src/app/types/api/ientity';
import { ApiCrudService } from 'src/app/api/services/api-crud.service';
import { EntityStateService } from 'src/app/state/entity/entity-state.service';
import { Unsubscribable } from 'rxjs';

@Component({
  selector: 'sr-readonly-screen',
  templateUrl: './readonly-screen.component.html',
  styleUrls: ['./readonly-screen.component.scss']
})
export class ReadonlyScreenComponent<
  T extends IEntity<TKey>,
  TKey extends EntityKey
> implements OnInit, OnDestroy {
  items: T[];
  isLoading: boolean;
  currentItem: T | null;

  private subscriptions: Unsubscribable[];

  constructor(
    protected apiService: ApiCrudService<T, TKey>,
    protected entityState: EntityStateService<T>
  ) {}

  ngOnInit() {
    this.getItems();
    this.subscriptions = [];
    this.subscriptions.push(
      this.entityState.collection$.subscribe(items => (this.items = items))
    );
    this.subscriptions.push(
      this.entityState.current$.subscribe(item => (this.currentItem = item))
    );
    this.subscriptions.push(
      this.entityState.loadingCollection$.subscribe(
        loading => (this.isLoading = loading)
      )
    );
  }

  ngOnDestroy() {
    for (const subscr of this.subscriptions) {
      subscr.unsubscribe();
    }
  }

  getItems() {
    this.entityState.loadingCollection$.next(true);
    this.apiService.getAll().subscribe(
      data => {
        this.entityState.collection$.next(data.result.items);
      },
      error => {},
      () => {
        this.entityState.loadingCollection$.next(false);
      }
    );
  }

  hideForm() {
    this.entityState.current$.next(null);
  }
}
