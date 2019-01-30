import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntityStateService<T> {
  readonly collection$ = new BehaviorSubject<T[]>([]);
  readonly current$ = new BehaviorSubject<T | null>(null);
  readonly isLoading$ = new BehaviorSubject<boolean>(false);

  constructor() { }
}
