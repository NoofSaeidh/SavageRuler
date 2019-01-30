import { Component, OnInit, Input } from '@angular/core';
import {
  ViewDescriptor,
  InfoGridField,
  FieldDescriptor,
} from 'src/app/types/descriptors/view-descriptor';
import { IEntity, EntityKey } from 'src/app/types/api/ientity';
import { EntityStateService } from 'src/app/state/entity/entity-state.service';

@Component({
  selector: 'sr-info-grid',
  templateUrl: './info-grid.component.html',
  styleUrls: ['./info-grid.component.scss'],
})
export class InfoGridComponent<T extends IEntity<TKey>, TKey extends EntityKey>
  implements OnInit {
  constructor(
    protected entityState: EntityStateService<T>,
    protected descriptor: ViewDescriptor<T>,
  ) {}

  get items(): T[] {
    return this.entityState.collection$.getValue();
  }

  get heads(): { key: keyof T; field: InfoGridField }[] {
    return Object.entries(this.descriptor.infoGrid).map(([key, value]) => {
      return {
        key: key as keyof T,
        field: value,
      };
    });
  }

  ngOnInit() {}
}
