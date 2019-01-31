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

  constructor(
    protected entityState: EntityStateService<T>,
    protected descriptor: ViewDescriptor<T>,
  ) {}

  ngOnInit() {
    this.fields = this.descriptor.infoGridEntries;
    this.entityState.collection$.subscribe(items => (this.items = items));
  }

  getThClass(field: InfoGridField): {} {
    return {
      'sort-column': field.sortable ? true : false
    };
  }
}
