import { Component, OnInit } from '@angular/core';
import { IEntity, EntityKey } from 'src/app/types/api/ientity';
import { ApiCrudService } from 'src/app/api/services/api-crud.service';
import { EntityStateService } from 'src/app/state/entity/entity-state.service';

@Component({
  selector: 'sr-readonly-screen',
  templateUrl: './readonly-screen.component.html',
  styleUrls: ['./readonly-screen.component.scss'],
})
export class ReadonlyScreenComponent<
  T extends IEntity<TKey>,
  TKey extends EntityKey
> implements OnInit {
  constructor(
    protected apiService: ApiCrudService<T, TKey>,
    protected entityState: EntityStateService<T>,
  ) {}

  ngOnInit() {
    this.getItems();
  }

  get isLoading(): boolean {
    return this.entityState.loadingCollection$.getValue();
  }

  get items(): T[] {
    return this.entityState.collection$.getValue();
  }

  get currentItem(): T | null {
    return this.entityState.current$.getValue();
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
      },
    );
  }
}
