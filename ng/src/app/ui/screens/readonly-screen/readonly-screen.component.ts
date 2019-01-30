import { Component, OnInit } from '@angular/core';
import { IEntity, EntityKey } from 'src/app/types/api/ientity';
import { ApiCrudService } from 'src/app/api/services/api-crud.service';

@Component({
  selector: 'sr-readonly-screen',
  templateUrl: './readonly-screen.component.html',
  styleUrls: ['./readonly-screen.component.scss'],
})
export class ReadonlyScreenComponent<
  T extends IEntity<TKey>,
  TKey extends EntityKey
> implements OnInit {
  items: T[];

  constructor(protected apiService: ApiCrudService<T, TKey>) {}

  ngOnInit() {
    this.getItems();
  }

  getItems() {
    this.apiService
      .getAll()
      .subscribe(result => (this.items = result.result.items));
  }
}
