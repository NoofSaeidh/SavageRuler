import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  ViewDescriptor,
  InfoGridField,
} from 'src/app/types/descriptors/view-descriptor';
import { IEntity, EntityKey } from 'src/app/api/types/ientity';
import { TypeEntry } from 'src/app/types/global/type-entry';
import { arraySorter } from 'src/app/types/global/array-sorter';
import { LocalizeDescriptor } from 'src/app/types/descriptors/localize-descriptor';

interface Header<T> {
  key: keyof T;
  class: {};
  field: InfoGridField;
}

type SortOrder = 'asc' | 'desc';

@Component({
  selector: 'sr-info-grid',
  templateUrl: './info-grid.component.html',
  styleUrls: ['./info-grid.component.scss'],
})
export class InfoGridComponent<T extends IEntity<TKey>, TKey extends EntityKey>
  implements OnInit {
  @Input() items: T[];
  @Input() view: ViewDescriptor<T>;
  @Input() localize: LocalizeDescriptor<T>;
  @Output() rowClicked = new EventEmitter<{ item: T; index: number; mouse: MouseEvent }>(true);
  headers: Header<T>[];
  fields: TypeEntry<T, InfoGridField>[];
  private sorted?: { key: keyof T; order: SortOrder };

  ngOnInit() {
    this.fields = this.view.infoGridEntries;
    this.headers = this.fields.map(value => {
      const class_ = {};
      if (value.value.sortable) {
        class_['sort-column'] = true;
      }
      return {
        key: value.key,
        class: class_,
        field: value.value,
      };
    });
  }

  clickHead(header: Header<T>, event: MouseEvent) {
    if (header.field.sortable) {
      this.sortItems(header);
    }
  }

  clickRow(item: T, index: number, event: MouseEvent) {
    console.log(item);
    console.log(index);

    this.rowClicked.emit({ item, index, mouse: event });
  }

  private sortItems(header: Header<T>) {
    const key = header.key;
    let order: SortOrder;
    if (!this.sorted) {
      order = 'asc';
    } else if (this.sorted.key !== key) {
      const oldHeader = this.headers.find(v => v.key === this.sorted.key);
      if (oldHeader) {
        this.setSortOrder(oldHeader, false);
      }
      order = 'asc';
    } else {
      order = this.opositeOrder(this.sorted.order);
    }
    this.sorted = { key, order };
    arraySorter.sortBy(this.items, key, order === 'desc');
    this.setSortOrder(header, this.sorted.order);
  }

  private opositeOrder(order: SortOrder): SortOrder {
    return order === 'asc' ? 'desc' : 'asc';
  }

  private setSortOrder(header: Header<T>, order: SortOrder | false) {
    header.class['sort-column-asc'] = order === 'asc';
    header.class['sort-column-desc'] = order === 'desc';
  }
}
