import { Component, OnInit, Input, OnChanges } from '@angular/core';
import {
  ViewDescriptor,
  InfoGridField,
  FieldDescriptor,
} from 'src/app/types/descriptors/view-descriptor';
import { IEntity, EntityKey } from 'src/app/types/api/ientity';
import { EntityStateService } from 'src/app/state/entity/entity-state.service';
import { RawTypeEntry, TypeEntry } from 'src/app/types/global/type-entry';

@Component({
  selector: 'sr-info-grid',
  templateUrl: './info-grid.component.html',
  styleUrls: ['./info-grid.component.scss'],
})
export class InfoGridComponent<T extends IEntity<TKey>, TKey extends EntityKey>
  implements OnInit {
  items: T[];
  fields: TypeEntry<T, InfoGridField>[];
  private sorted: { key: keyof T; order: 'asc' | 'desc' } | false = false;

  constructor(
    protected entityState: EntityStateService<T>,
    protected descriptor: ViewDescriptor<T>,
  ) {}

  ngOnInit() {
    this.fields = this.descriptor.infoGridEntries;
    this.entityState.collection$.subscribe(items => (this.items = items));
  }

  clickHead(field: TypeEntry<T, InfoGridField>, event: MouseEvent) {
    if (field.value.sortable) {
      this.sortItems(field.key);
    }
  }

  sortItems(key: keyof T) {
    if (!this.sorted || this.sorted.key !== key) {
      this.items.sort(this.sortFunction(true));
      this.sorted = {
        key: key,
        order: 'asc',
      };
    } else {
      const order = this.sorted.order === 'asc' ? 'desc' : 'asc';
      this.items.sort(this.sortFunction(order === 'asc'));
      this.sorted.order = order;
    }
    console.log(JSON.stringify(this.sorted));
    // console.log(JSON.stringify(this.items));
    // this.items = [...this.items];
  }

  private sortFunction<Ts>(asc: boolean) {
    return (a: Ts, b: Ts) => {
      if (a > b) {
        return asc ? 1 : -1;
      }
      if (b > a) {
        return asc ? -1 : 1;
      }
      return 0;
    };
  }
}
