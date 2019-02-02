import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class EntityStateService<T> {
  readonly collection$ = new BehaviorSubject<T[]>([]);
  readonly current$ = new BehaviorSubject<T | null>(null);
  readonly loadingCollection$ = new BehaviorSubject<boolean>(false);
  readonly loadingCurrent$ = new BehaviorSubject<boolean>(false);
  readonly extra$ = new BehaviorSubject<{}>({});
  constructor() {}
}
