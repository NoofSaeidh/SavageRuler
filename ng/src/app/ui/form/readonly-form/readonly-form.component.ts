import { Component, Input, OnInit } from '@angular/core';
import { LocalizeDescriptor } from 'src/app/types/descriptors/localize-descriptor';
import { TypeEntry } from 'src/app/types/global/type-entry';

import { ReadFormField, ViewDescriptor } from './../../../types/descriptors/view-descriptor';

@Component({
  selector: 'sr-readonly-form',
  templateUrl: './readonly-form.component.html',
  styleUrls: ['./readonly-form.component.scss']
})
export class ReadonlyFormComponent<T> implements OnInit {
  @Input() item: T;
  @Input() view: ViewDescriptor<T>;
  @Input() localize: LocalizeDescriptor<T>;

  constructor() {}

  ngOnInit() {
    console.log('form initialized');
  }

  get title(): string {
    return String(this.item[this.view.titleKey]);
  }

  get fields(): TypeEntry<T, ReadFormField>[] {
    return this.view.readFromEntries;
  }
}
