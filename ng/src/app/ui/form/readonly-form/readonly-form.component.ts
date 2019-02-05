import { ViewDescriptor, ReadFormField } from './../../../types/descriptors/view-descriptor';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Unsubscribable } from 'rxjs';
import { TypeEntry } from 'src/app/types/global/type-entry';

@Component({
  selector: 'sr-readonly-form',
  templateUrl: './readonly-form.component.html',
  styleUrls: ['./readonly-form.component.scss']
})
export class ReadonlyFormComponent<T> implements OnInit {
  @Input() item: T;

  constructor(
    private viewDescriptor: ViewDescriptor<T>
  ) {}

  ngOnInit() {
    console.log('form initialized');
  }

  get title(): string {
    return String(this.item[this.viewDescriptor.titleKey]);
  }

  get fields(): TypeEntry<T, ReadFormField>[] {
    return this.viewDescriptor.readFromEntries;
  }
}
