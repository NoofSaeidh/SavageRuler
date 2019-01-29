import { Component, OnInit, Input } from '@angular/core';
import { ViewDescriptor } from 'src/app/types/descriptors/view-descriptor';
import { IEntity, EntityKey } from 'src/app/types/api/ientity';

@Component({
  selector: 'sr-info-grid',
  templateUrl: './info-grid.component.html',
  styleUrls: ['./info-grid.component.scss']
})
export class InfoGridComponent<T extends IEntity<TKey>, TKey extends EntityKey> implements OnInit {
  @Input() items: T[];
  @Input() descriptor: ViewDescriptor<T>;

  constructor() { }

  ngOnInit() {
  }

}
