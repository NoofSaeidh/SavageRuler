import { Injectable } from '@angular/core';
import { BaseStateService } from '../base-state.service';
import { LoadState } from '../types/load-state';
import { State } from '../types/state';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable()
export class LoadStateService<T> extends BaseStateService<T, LoadState<T>> {
  constructor() {
    super(new LoadState());
  }

  load(source: Observable<T>): void {
    this.subject.next(LoadState.fromLoading());
    source.pipe(first()).subscribe(
      (x) => { this.subject.next(LoadState.fromLoaded(x)); }
    );
  }
}
