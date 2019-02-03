import { ViewDescriptor } from './../../../types/descriptors/view-descriptor';
import { EntityStateService } from './../../../state/entity/entity-state.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Unsubscribable } from 'rxjs';

@Component({
  selector: 'sr-readonly-form',
  templateUrl: './readonly-form.component.html',
  styleUrls: ['./readonly-form.component.scss']
})
export class ReadonlyFormComponent<T> implements OnInit, OnDestroy {
  item: T;

  private subscription: Unsubscribable;

  constructor(
    private entityState: EntityStateService<T>,
    private viewDescriptor: ViewDescriptor<T>
  ) {}

  ngOnInit() {
    this.subscription = this.entityState.current$.subscribe(
      item => (this.item = item)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get title(): string {
    return String(this.item[this.viewDescriptor.titleKey]);
  }
}
